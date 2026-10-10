import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Branch } from '../module-branch/entity/branch.entity';
import { BranchStatus } from '../module-branch/enum/branch-status.enum';
import { Patient } from '../module-patient/entity/patient.entity';
import { PatientStatus } from '../module-patient/enum/patient-status.enum';
import { Service } from '../module-service/entity/service.entity';
import { ServiceStatus } from '../module-service/enum/service-status.enum';
import { User } from '../module-user/entity/user.entity';
import { UserStatus } from '../module-user/enum/user-status.enum';
import { CreatePatientSpecialPriceDto } from './dto/request/create-patient-special-price.dto';
import { FindPatientSpecialPriceQueryDto } from './dto/request/find-patient-special-price-query.dto';
import { UpdatePatientSpecialPriceDto } from './dto/request/update-patient-special-price.dto';
import { PatientSpecialPriceMapper } from './dto/patient-special-price.mapper';
import { PatientSpecialPriceResponseDto } from './dto/response/patient-special-price-response.dto';
import { PatientSpecialPrice } from './entity/patient-special-price.entity';
import { SpecialPriceStatus } from './enum/special-price-status.enum';

@Injectable()
export class PatientSpecialPriceService {
  constructor(
    @InjectRepository(PatientSpecialPrice)
    private readonly repository: Repository<PatientSpecialPrice>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    filters: FindPatientSpecialPriceQueryDto = {},
  ): Promise<OffsetPaginatedResult<PatientSpecialPriceResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.query().orderBy('specialPrice.validFrom', 'DESC');
    if (filters.patientId)
      query.andWhere('patient.patientId = :patientId', {
        patientId: filters.patientId,
      });
    if (filters.serviceId)
      query.andWhere('service.serviceId = :serviceId', {
        serviceId: filters.serviceId,
      });
    if (filters.branchId)
      query.andWhere('branch.branchId = :branchId', {
        branchId: filters.branchId,
      });
    if (filters.status)
      query.andWhere('specialPrice.status = :status', {
        status: filters.status,
      });
    if (filters.effectiveOn)
      query.andWhere(
        'specialPrice.validFrom <= :effectiveOn AND (specialPrice.validUntil IS NULL OR specialPrice.validUntil >= :effectiveOn)',
        { effectiveOn: filters.effectiveOn },
      );
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(PatientSpecialPriceMapper.toResponseDto),
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

  async findOne(id: number): Promise<PatientSpecialPriceResponseDto> {
    return PatientSpecialPriceMapper.toResponseDto(await this.findOrThrow(id));
  }

  async create(
    dto: CreatePatientSpecialPriceDto,
    authorizedByUserId: number,
  ): Promise<PatientSpecialPriceResponseDto> {
    this.ensureDateRange(dto.validFrom, dto.validUntil ?? null);
    const [patient, service, branch, user] = await Promise.all([
      this.findPatientOrThrow(dto.patientId),
      this.findServiceOrThrow(dto.serviceId),
      dto.branchId
        ? this.findBranchOrThrow(dto.branchId)
        : Promise.resolve(null),
      this.findUserOrThrow(authorizedByUserId),
    ]);
    this.ensureEligible(patient, service, branch);
    await this.ensureNoOverlap(
      patient.patientId,
      service.serviceId,
      branch?.branchId ?? null,
      dto.validFrom,
      dto.validUntil ?? null,
    );
    const specialPrice = await this.repository.save(
      this.repository.create({
        patient,
        service,
        branch,
        authorizedByUser: user,
        price: dto.price,
        validFrom: dto.validFrom,
        validUntil: dto.validUntil ?? null,
        reason: dto.reason ?? null,
        status: this.statusFor(dto.validFrom, dto.validUntil ?? null),
      }),
    );
    return PatientSpecialPriceMapper.toResponseDto(
      await this.findOrThrow(specialPrice.patientSpecialPriceId),
    );
  }

  async update(
    id: number,
    dto: UpdatePatientSpecialPriceDto,
  ): Promise<PatientSpecialPriceResponseDto> {
    const specialPrice = await this.findOrThrow(id);
    if (
      specialPrice.status === SpecialPriceStatus.EXPIRED ||
      specialPrice.status === SpecialPriceStatus.REVOKED
    )
      throw new BadRequestException(
        'Expired or revoked special prices cannot be edited',
      );
    const branch =
      dto.branchId === undefined
        ? specialPrice.branch
        : dto.branchId === null
          ? null
          : await this.findBranchOrThrow(dto.branchId);
    const validFrom = dto.validFrom ?? specialPrice.validFrom;
    const validUntil =
      dto.validUntil === undefined ? specialPrice.validUntil : dto.validUntil;
    this.ensureDateRange(validFrom, validUntil);
    this.ensureEligible(specialPrice.patient, specialPrice.service, branch);
    await this.ensureNoOverlap(
      specialPrice.patient.patientId,
      specialPrice.service.serviceId,
      branch?.branchId ?? null,
      validFrom,
      validUntil,
      id,
    );
    specialPrice.branch = branch;
    specialPrice.validFrom = validFrom;
    specialPrice.validUntil = validUntil;
    specialPrice.status = this.statusFor(validFrom, validUntil);
    if (dto.price !== undefined) specialPrice.price = dto.price;
    if (dto.reason !== undefined) specialPrice.reason = dto.reason;
    return PatientSpecialPriceMapper.toResponseDto(
      await this.repository.save(specialPrice),
    );
  }

  async approve(id: number): Promise<PatientSpecialPriceResponseDto> {
    const specialPrice = await this.findOrThrow(id);
    if (
      specialPrice.status === SpecialPriceStatus.REVOKED ||
      specialPrice.status === SpecialPriceStatus.EXPIRED
    )
      throw new BadRequestException(
        'Expired or revoked special prices cannot be approved',
      );
    this.ensureEligible(
      specialPrice.patient,
      specialPrice.service,
      specialPrice.branch,
    );
    specialPrice.status = this.statusFor(
      specialPrice.validFrom,
      specialPrice.validUntil,
    );
    return PatientSpecialPriceMapper.toResponseDto(
      await this.repository.save(specialPrice),
    );
  }

  async remove(id: number): Promise<void> {
    const specialPrice = await this.findOrThrow(id);
    if (specialPrice.status === SpecialPriceStatus.REVOKED) return;
    specialPrice.status = SpecialPriceStatus.REVOKED;
    await this.repository.save(specialPrice);
  }

  private query() {
    return this.repository
      .createQueryBuilder('specialPrice')
      .leftJoinAndSelect('specialPrice.patient', 'patient')
      .leftJoinAndSelect('specialPrice.service', 'service')
      .leftJoinAndSelect('specialPrice.branch', 'branch')
      .leftJoinAndSelect('specialPrice.authorizedByUser', 'authorizedByUser');
  }
  private async findOrThrow(id: number): Promise<PatientSpecialPrice> {
    const specialPrice = await this.query()
      .where('specialPrice.patientSpecialPriceId = :id', { id })
      .getOne();
    if (!specialPrice)
      throw new NotFoundException(
        `Patient special price with id ${id} not found`,
      );
    return specialPrice;
  }
  private async findPatientOrThrow(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ patientId: id });
    if (!patient)
      throw new NotFoundException(`Patient with id ${id} not found`);
    return patient;
  }
  private async findServiceOrThrow(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({ serviceId: id });
    if (!service)
      throw new NotFoundException(`Service with id ${id} not found`);
    return service;
  }
  private async findBranchOrThrow(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOneBy({ branchId: id });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }
  private async findUserOrThrow(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user || user.status !== UserStatus.ACTIVE)
      throw new NotFoundException(`Active user with id ${id} not found`);
    return user;
  }
  private ensureDateRange(validFrom: string, validUntil: string | null): void {
    if (validUntil && validUntil < validFrom)
      throw new BadRequestException('validUntil cannot be before validFrom');
  }
  private ensureEligible(
    patient: Patient,
    service: Service,
    branch: Branch | null,
  ): void {
    if (patient.status !== PatientStatus.ACTIVE)
      throw new BadRequestException(
        'A special price requires an active patient',
      );
    if (service.status !== ServiceStatus.ACTIVE)
      throw new BadRequestException(
        'A special price requires an active service',
      );
    if (branch && branch.status !== BranchStatus.ACTIVE)
      throw new BadRequestException(
        'A branch-specific special price requires an active branch',
      );
  }
  private statusFor(
    validFrom: string,
    validUntil: string | null,
  ): SpecialPriceStatus {
    const today = new Date().toISOString().slice(0, 10);
    if (validUntil && validUntil < today) return SpecialPriceStatus.EXPIRED;
    return validFrom > today
      ? SpecialPriceStatus.SCHEDULED
      : SpecialPriceStatus.ACTIVE;
  }
  private async ensureNoOverlap(
    patientId: number,
    serviceId: number,
    branchId: number | null,
    validFrom: string,
    validUntil: string | null,
    excludeId?: number,
  ): Promise<void> {
    const query = this.repository
      .createQueryBuilder('specialPrice')
      .where('specialPrice.patient_id = :patientId', { patientId })
      .andWhere('specialPrice.service_id = :serviceId', { serviceId })
      .andWhere('specialPrice.status IN (:...statuses)', {
        statuses: [SpecialPriceStatus.SCHEDULED, SpecialPriceStatus.ACTIVE],
      });
    if (branchId === null) query.andWhere('specialPrice.branch_id IS NULL');
    else query.andWhere('specialPrice.branch_id = :branchId', { branchId });
    if (excludeId)
      query.andWhere('specialPrice.patient_special_price_id != :excludeId', {
        excludeId,
      });
    query
      .andWhere(
        '(specialPrice.valid_until IS NULL OR specialPrice.valid_until >= :validFrom)',
        { validFrom },
      )
      .andWhere(
        '(:validUntil IS NULL OR specialPrice.valid_from <= :validUntil)',
        { validUntil },
      );
    if (await query.getExists())
      throw new ConflictException(
        'An overlapping special price already exists for this patient, service, and branch scope',
      );
  }
}
