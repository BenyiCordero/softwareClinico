import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Branch } from '../module-branch/entity/branch.entity';
import { AREA_CONSTRAINT_MAP } from './const/area.constraint';
import { CreateAreaDto } from './dto/request/create-area.dto';
import { FindAreaQueryDto } from './dto/request/find-area-query.dto';
import { UpdateAreaDto } from './dto/request/update-area.dto';
import { AreaMapper } from './dto/area.mapper';
import { AreaResponseDto } from './dto/response/area-response.dto';
import { Area } from './entity/area.entity';
import { AreaStatus } from './enum/area-status.enum';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area) private readonly repository: Repository<Area>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(
    filters: FindAreaQueryDto = {},
  ): Promise<OffsetPaginatedResult<AreaResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.baseQuery().orderBy('area.name', 'ASC');
    if (filters.branchId)
      query.andWhere('branch.branch_id = :branchId', {
        branchId: filters.branchId,
      });
    if (filters.parentAreaId)
      query.andWhere('parentArea.area_id = :parentAreaId', {
        parentAreaId: filters.parentAreaId,
      });
    if (filters.name)
      query.andWhere('area.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status)
      query.andWhere('area.status = :status', { status: filters.status });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(AreaMapper.toResponseDto),
      pagination: {
        type: PaginationEnum.OFFSET,
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<AreaResponseDto> {
    return AreaMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreateAreaDto): Promise<AreaResponseDto> {
    const branch = await this.findBranchOrThrow(dto.branchId);
    const parent = dto.parentAreaId
      ? await this.findByIdOrThrow(dto.parentAreaId)
      : null;
    this.ensureParentBelongsToBranch(parent, branch.branchId);
    await this.ensureNameAvailable(
      dto.name,
      branch.branchId,
      parent?.areaId ?? null,
    );
    try {
      return AreaMapper.toResponseDto(
        await this.repository.save(
          this.repository.create({
            branch,
            parentArea: parent,
            name: dto.name,
            description: dto.description,
          }),
        ),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        AREA_CONSTRAINT_MAP,
      );
    }
  }

  async update(id: number, dto: UpdateAreaDto): Promise<AreaResponseDto> {
    const area = await this.findByIdOrThrow(id);
    const branch =
      dto.branchId === undefined
        ? area.branch
        : await this.findBranchOrThrow(dto.branchId);
    const parent =
      dto.parentAreaId === undefined
        ? area.parentArea
        : dto.parentAreaId === null
          ? null
          : await this.findByIdOrThrow(dto.parentAreaId);
    if (parent?.areaId === id)
      throw new BadRequestException('An area cannot be its own parent');
    this.ensureParentBelongsToBranch(parent, branch.branchId);
    if (parent && (await this.isDescendant(parent.areaId, id))) {
      throw new BadRequestException(
        'An area cannot be moved below one of its descendants',
      );
    }
    const name = dto.name ?? area.name;
    const parentId = parent?.areaId ?? null;
    const previousParentId = area.parentArea?.areaId ?? null;
    if (
      name !== area.name ||
      branch.branchId !== area.branch.branchId ||
      parentId !== previousParentId
    ) {
      await this.ensureNameAvailable(name, branch.branchId, parentId, id);
    }
    area.branch = branch;
    area.parentArea = parent;
    if (dto.name !== undefined) area.name = dto.name;
    if (dto.description !== undefined) area.description = dto.description;
    if (dto.status !== undefined) area.status = dto.status;
    try {
      return AreaMapper.toResponseDto(await this.repository.save(area));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        AREA_CONSTRAINT_MAP,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const area = await this.findByIdOrThrow(id);
    if (area.status === AreaStatus.INACTIVE) return;
    area.status = AreaStatus.INACTIVE;
    await this.repository.save(area);
  }

  async findByIdOrThrow(id: number): Promise<Area> {
    const area = await this.baseQuery()
      .where('area.areaId = :id', { id })
      .getOne();
    if (!area) throw new NotFoundException(`Area with id ${id} not found`);
    return area;
  }

  private baseQuery() {
    return this.repository
      .createQueryBuilder('area')
      .leftJoinAndSelect('area.branch', 'branch')
      .leftJoinAndSelect('area.parentArea', 'parentArea');
  }

  private async findBranchOrThrow(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOneBy({ branchId: id });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  private ensureParentBelongsToBranch(
    parent: Area | null,
    branchId: number,
  ): void {
    if (parent && parent.branch.branchId !== branchId) {
      throw new BadRequestException(
        'The parent area must belong to the same branch',
      );
    }
  }

  private async ensureNameAvailable(
    name: string,
    branchId: number,
    parentAreaId: number | null,
    excludeId?: number,
  ): Promise<void> {
    const query = this.repository
      .createQueryBuilder('area')
      .where('area.branch_id = :branchId', { branchId })
      .andWhere('area.name = :name', { name });
    if (parentAreaId === null) query.andWhere('area.parent_area_id IS NULL');
    else
      query.andWhere('area.parent_area_id = :parentAreaId', { parentAreaId });
    if (excludeId) query.andWhere('area.area_id != :excludeId', { excludeId });
    if (await query.getExists())
      throw new ConflictException(
        `Area name ${name} is already in use at this hierarchy level`,
      );
  }

  private async isDescendant(
    candidateId: number,
    ancestorId: number,
  ): Promise<boolean> {
    let currentId: number | null = candidateId;
    while (currentId !== null) {
      if (currentId === ancestorId) return true;
      const area = await this.repository.findOne({
        where: { areaId: currentId },
        relations: { parentArea: true },
      });
      currentId = area?.parentArea?.areaId ?? null;
    }
    return false;
  }
}
