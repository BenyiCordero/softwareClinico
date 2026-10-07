import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Branch } from '../module-branch/entity/branch.entity';
import { BranchStatus } from '../module-branch/enum/branch-status.enum';
import { PatientCategory } from '../module-patient-category/entity/patient-category.entity';
import { PatientCategoryStatus } from '../module-patient-category/enum/patient-category-status.enum';
import { Service } from '../module-service/entity/service.entity';
import { ServiceStatus } from '../module-service/enum/service-status.enum';
import { PRICE_LIST_CONSTRAINT_MAP } from './const/price-list.constraint';
import { CreatePriceListDetailDto } from './dto/request/create-price-list-detail.dto';
import { CreatePriceListDto } from './dto/request/create-price-list.dto';
import { FindPriceListQueryDto } from './dto/request/find-price-list-query.dto';
import { UpdatePriceListDetailDto } from './dto/request/update-price-list-detail.dto';
import { UpdatePriceListDto } from './dto/request/update-price-list.dto';
import { PriceListMapper } from './dto/price-list.mapper';
import { PriceListDetailResponseDto } from './dto/response/price-list-detail-response.dto';
import { PriceListResponseDto } from './dto/response/price-list-response.dto';
import { PriceListDetail } from './entity/price-list-detail.entity';
import { PriceList } from './entity/price-list.entity';
import { PriceDetailStatus } from './enum/price-detail-status.enum';
import { PriceListStatus } from './enum/price-list-status.enum';

@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceList) private readonly listRepository: Repository<PriceList>,
    @InjectRepository(PriceListDetail) private readonly detailRepository: Repository<PriceListDetail>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
    @InjectRepository(PatientCategory) private readonly categoryRepository: Repository<PatientCategory>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(filters: FindPriceListQueryDto = {}): Promise<OffsetPaginatedResult<PriceListResponseDto>> {
    const page = filters.page ?? 1; const limit = filters.limit ?? 100;
    const query = this.listQuery().orderBy('list.priority', 'DESC').addOrderBy('list.validFrom', 'DESC');
    if (filters.branchId) query.andWhere('branch.branchId = :branchId', { branchId: filters.branchId });
    if (filters.patientCategoryId) query.andWhere('patientCategory.patientCategoryId = :patientCategoryId', { patientCategoryId: filters.patientCategoryId });
    if (filters.name) query.andWhere('list.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.currency) query.andWhere('list.currency = :currency', { currency: filters.currency.toUpperCase() });
    if (filters.status) query.andWhere('list.status = :status', { status: filters.status });
    if (filters.effectiveOn) query.andWhere('list.validFrom <= :effectiveOn AND (list.validUntil IS NULL OR list.validUntil >= :effectiveOn)', { effectiveOn: filters.effectiveOn });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return { data: entities.map(PriceListMapper.toResponseDto), pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 } };
  }

  async findOne(id: number): Promise<PriceListResponseDto> { return PriceListMapper.toResponseDto(await this.findListOrThrow(id)); }

  async create(dto: CreatePriceListDto): Promise<PriceListResponseDto> {
    this.ensureDateRange(dto.validFrom, dto.validUntil ?? null);
    const [branch, patientCategory] = await Promise.all([dto.branchId ? this.findBranchOrThrow(dto.branchId) : Promise.resolve(null), dto.patientCategoryId ? this.findCategoryOrThrow(dto.patientCategoryId) : Promise.resolve(null)]);
    const list = await this.listRepository.save(this.listRepository.create({ ...dto, branch, patientCategory, validUntil: dto.validUntil ?? null, status: PriceListStatus.DRAFT }));
    return PriceListMapper.toResponseDto(await this.findListOrThrow(list.priceListId));
  }

  async update(id: number, dto: UpdatePriceListDto): Promise<PriceListResponseDto> {
    const list = await this.findListOrThrow(id);
    if (list.status !== PriceListStatus.DRAFT) throw new BadRequestException('Only draft price lists can be edited');
    const branch = dto.branchId === undefined ? list.branch : dto.branchId === null ? null : await this.findBranchOrThrow(dto.branchId);
    const patientCategory = dto.patientCategoryId === undefined ? list.patientCategory : dto.patientCategoryId === null ? null : await this.findCategoryOrThrow(dto.patientCategoryId);
    const validFrom = dto.validFrom ?? list.validFrom; const validUntil = dto.validUntil === undefined ? list.validUntil : dto.validUntil;
    this.ensureDateRange(validFrom, validUntil);
    list.branch = branch; list.patientCategory = patientCategory;
    Object.assign(list, { ...dto, validFrom, validUntil });
    return PriceListMapper.toResponseDto(await this.listRepository.save(list));
  }

  async publish(id: number): Promise<PriceListResponseDto> {
    const list = await this.findListOrThrow(id);
    if (list.status !== PriceListStatus.DRAFT) throw new BadRequestException('Only draft price lists can be published');
    await this.ensurePublishable(list);
    list.status = list.validFrom > this.today() ? PriceListStatus.SCHEDULED : PriceListStatus.ACTIVE;
    return PriceListMapper.toResponseDto(await this.listRepository.save(list));
  }

  async unpublish(id: number): Promise<PriceListResponseDto> {
    const list = await this.findListOrThrow(id);
    if (list.status !== PriceListStatus.SCHEDULED) throw new BadRequestException('Only scheduled price lists can be unpublished');
    list.status = PriceListStatus.DRAFT;
    return PriceListMapper.toResponseDto(await this.listRepository.save(list));
  }

  async remove(id: number): Promise<void> {
    const list = await this.findListOrThrow(id);
    if (list.status === PriceListStatus.CANCELLED) return;
    list.status = PriceListStatus.CANCELLED;
    await this.listRepository.save(list);
  }

  async findDetails(listId: number): Promise<PriceListDetailResponseDto[]> {
    await this.findListOrThrow(listId);
    const details = await this.detailQuery().where('list.priceListId = :listId', { listId }).orderBy('service.name', 'ASC').getMany();
    return details.map(PriceListMapper.toDetailResponseDto);
  }

  async createDetail(listId: number, dto: CreatePriceListDetailDto): Promise<PriceListDetailResponseDto> {
    const list = await this.findListOrThrow(listId);
    if (list.status !== PriceListStatus.DRAFT) throw new BadRequestException('Only draft price lists can be edited');
    const service = await this.findServiceOrThrow(dto.serviceId);
    const detail = this.detailRepository.create({ priceList: list, service, price: dto.price, status: PriceDetailStatus.ACTIVE });
    try { const saved = await this.detailRepository.save(detail); return PriceListMapper.toDetailResponseDto(await this.findDetailOrThrow(listId, saved.priceListDetailId)); }
    catch (error: unknown) { throw this.databaseExceptionMapper.fromTypeOrmError(error, PRICE_LIST_CONSTRAINT_MAP); }
  }

  async updateDetail(listId: number, detailId: number, dto: UpdatePriceListDetailDto): Promise<PriceListDetailResponseDto> {
    const list = await this.findListOrThrow(listId);
    if (list.status !== PriceListStatus.DRAFT) throw new BadRequestException('Only draft price lists can be edited');
    const detail = await this.findDetailOrThrow(listId, detailId);
    if (dto.price !== undefined) detail.price = dto.price;
    if (dto.status !== undefined) detail.status = dto.status;
    return PriceListMapper.toDetailResponseDto(await this.detailRepository.save(detail));
  }

  async removeDetail(listId: number, detailId: number): Promise<void> {
    const list = await this.findListOrThrow(listId);
    if (list.status !== PriceListStatus.DRAFT) throw new BadRequestException('Only draft price lists can be edited');
    const detail = await this.findDetailOrThrow(listId, detailId);
    if (detail.status === PriceDetailStatus.INACTIVE) return;
    detail.status = PriceDetailStatus.INACTIVE;
    await this.detailRepository.save(detail);
  }

  private listQuery() { return this.listRepository.createQueryBuilder('list').leftJoinAndSelect('list.branch', 'branch').leftJoinAndSelect('list.patientCategory', 'patientCategory'); }
  private detailQuery() { return this.detailRepository.createQueryBuilder('detail').leftJoinAndSelect('detail.priceList', 'list').leftJoinAndSelect('detail.service', 'service'); }
  private async findListOrThrow(id: number): Promise<PriceList> { const list = await this.listQuery().where('list.priceListId = :id', { id }).getOne(); if (!list) throw new NotFoundException(`Price list with id ${id} not found`); return list; }
  private async findDetailOrThrow(listId: number, detailId: number): Promise<PriceListDetail> { const detail = await this.detailQuery().where('detail.priceListDetailId = :detailId', { detailId }).andWhere('list.priceListId = :listId', { listId }).getOne(); if (!detail) throw new NotFoundException(`Price list detail with id ${detailId} not found`); return detail; }
  private async findBranchOrThrow(id: number): Promise<Branch> { const branch = await this.branchRepository.findOneBy({ branchId: id }); if (!branch) throw new NotFoundException(`Branch with id ${id} not found`); return branch; }
  private async findCategoryOrThrow(id: number): Promise<PatientCategory> { const category = await this.categoryRepository.findOneBy({ patientCategoryId: id }); if (!category) throw new NotFoundException(`Patient category with id ${id} not found`); return category; }
  private async findServiceOrThrow(id: number): Promise<Service> { const service = await this.serviceRepository.findOneBy({ serviceId: id }); if (!service) throw new NotFoundException(`Service with id ${id} not found`); return service; }
  private ensureDateRange(validFrom: string, validUntil: string | null): void { if (validUntil && validUntil < validFrom) throw new BadRequestException('validUntil cannot be before validFrom'); }
  private today(): string { return new Date().toISOString().slice(0, 10); }
  private async ensurePublishable(list: PriceList): Promise<void> {
    if (list.branch && list.branch.status !== BranchStatus.ACTIVE) throw new BadRequestException('An active price list requires an active branch');
    if (list.patientCategory && list.patientCategory.status !== PatientCategoryStatus.ACTIVE) throw new BadRequestException('An active price list requires an active patient category');
    const activeDetails = await this.detailRepository.count({ where: { priceList: { priceListId: list.priceListId }, status: PriceDetailStatus.ACTIVE } });
    if (!activeDetails) throw new BadRequestException('A price list needs at least one active detail before publishing');
    const inactiveServiceDetail = await this.detailQuery().where('list.priceListId = :listId', { listId: list.priceListId }).andWhere('detail.status = :status', { status: PriceDetailStatus.ACTIVE }).andWhere('service.status != :serviceStatus', { serviceStatus: ServiceStatus.ACTIVE }).getOne();
    if (inactiveServiceDetail) throw new BadRequestException('An active price list cannot include an inactive service');
  }
}
