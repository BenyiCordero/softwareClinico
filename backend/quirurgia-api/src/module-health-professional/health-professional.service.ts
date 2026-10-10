import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Employee } from '../module-employee/entity/employee.entity';
import { EmployeeStatus } from '../module-employee/enum/employee-status.enum';
import { Specialty } from '../module-specialty/entity/specialty.entity';
import { SpecialtyStatus } from '../module-specialty/enum/specialty-status.enum';
import { HEALTH_PROFESSIONAL_CONSTRAINT_MAP } from './const/health-professional.constraint';
import { AssignProfessionalSpecialtyDto } from './dto/request/assign-professional-specialty.dto';
import { CreateHealthProfessionalDto } from './dto/request/create-health-professional.dto';
import { FindHealthProfessionalQueryDto } from './dto/request/find-health-professional-query.dto';
import { UpdateHealthProfessionalDto } from './dto/request/update-health-professional.dto';
import { HealthProfessionalMapper } from './dto/health-professional.mapper';
import { HealthProfessionalResponseDto } from './dto/response/health-professional-response.dto';
import { ProfessionalSpecialtyResponseDto } from './dto/response/professional-specialty-response.dto';
import { HealthProfessional } from './entity/health-professional.entity';
import { ProfessionalSpecialty } from './entity/professional-specialty.entity';
import { HealthProfessionalStatus } from './enum/health-professional-status.enum';
import { SpecialtyPriority } from './enum/specialty-priority.enum';

@Injectable()
export class HealthProfessionalService {
  constructor(
    @InjectRepository(HealthProfessional)
    private readonly professionalRepository: Repository<HealthProfessional>,
    @InjectRepository(ProfessionalSpecialty)
    private readonly professionalSpecialtyRepository: Repository<ProfessionalSpecialty>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    private readonly dataSource: DataSource,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(
    filters: FindHealthProfessionalQueryDto = {},
  ): Promise<OffsetPaginatedResult<HealthProfessionalResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.professionalQuery().orderBy(
      'professional.professionalLicense',
      'ASC',
    );
    if (filters.employeeId)
      query.andWhere('employee.employee_id = :employeeId', {
        employeeId: filters.employeeId,
      });
    if (filters.professionalLicense)
      query.andWhere(
        'professional.professionalLicense ILIKE :professionalLicense',
        { professionalLicense: `%${filters.professionalLicense}%` },
      );
    if (filters.status)
      query.andWhere('professional.status = :status', {
        status: filters.status,
      });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(HealthProfessionalMapper.toResponseDto),
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

  async findOne(id: number): Promise<HealthProfessionalResponseDto> {
    return HealthProfessionalMapper.toResponseDto(
      await this.findByIdOrThrow(id),
    );
  }

  async create(
    dto: CreateHealthProfessionalDto,
  ): Promise<HealthProfessionalResponseDto> {
    const employee = await this.findEmployeeOrThrow(dto.employeeId);
    if (employee.status !== EmployeeStatus.ACTIVE)
      throw new BadRequestException(
        'Only an active employee can become a health professional',
      );
    await this.ensureLicenseAvailable(dto.professionalLicense);
    if (
      await this.professionalRepository.exists({
        where: { employee: { employeeId: employee.employeeId } },
      })
    ) {
      throw new ConflictException(
        'This employee already has a health professional profile',
      );
    }
    try {
      const professional = await this.professionalRepository.save(
        this.professionalRepository.create({
          employee,
          professionalLicense: dto.professionalLicense,
          specialtyLicense: dto.specialtyLicense ?? null,
          bio: dto.bio ?? null,
          status: HealthProfessionalStatus.ACTIVE,
        }),
      );
      return HealthProfessionalMapper.toResponseDto(
        await this.findByIdOrThrow(professional.healthProfessionalId),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        HEALTH_PROFESSIONAL_CONSTRAINT_MAP,
      );
    }
  }

  async update(
    id: number,
    dto: UpdateHealthProfessionalDto,
  ): Promise<HealthProfessionalResponseDto> {
    const professional = await this.findByIdOrThrow(id);
    const status = dto.status ?? professional.status;
    if (
      status === HealthProfessionalStatus.ACTIVE &&
      professional.employee.status !== EmployeeStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'An active health professional requires an active employee',
      );
    }
    if (
      dto.professionalLicense &&
      dto.professionalLicense !== professional.professionalLicense
    ) {
      await this.ensureLicenseAvailable(dto.professionalLicense, id);
    }
    try {
      return HealthProfessionalMapper.toResponseDto(
        await this.professionalRepository.save(
          this.professionalRepository.merge(professional, dto),
        ),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        HEALTH_PROFESSIONAL_CONSTRAINT_MAP,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const professional = await this.findByIdOrThrow(id);
    if (professional.status === HealthProfessionalStatus.INACTIVE) return;
    professional.status = HealthProfessionalStatus.INACTIVE;
    await this.professionalRepository.save(professional);
  }

  async findSpecialties(
    professionalId: number,
  ): Promise<ProfessionalSpecialtyResponseDto[]> {
    await this.findByIdOrThrow(professionalId);
    const specialties = await this.specialtyQuery()
      .where('professional.healthProfessionalId = :professionalId', {
        professionalId,
      })
      .orderBy('assignment.priority', 'ASC')
      .getMany();
    return specialties.map(HealthProfessionalMapper.toSpecialtyResponseDto);
  }

  async assignSpecialty(
    professionalId: number,
    dto: AssignProfessionalSpecialtyDto,
  ): Promise<ProfessionalSpecialtyResponseDto> {
    const [professional, specialty] = await Promise.all([
      this.findByIdOrThrow(professionalId),
      this.findSpecialtyOrThrow(dto.specialtyId),
    ]);
    const duplicate = await this.professionalSpecialtyRepository.exists({
      where: {
        healthProfessional: { healthProfessionalId: professionalId },
        specialty: { specialtyId: specialty.specialtyId },
      },
    });
    if (duplicate)
      throw new ConflictException(
        'This specialty is already assigned to the health professional',
      );
    if (dto.priority === SpecialtyPriority.PRIMARY) {
      const primary = await this.professionalSpecialtyRepository.exists({
        where: {
          healthProfessional: { healthProfessionalId: professionalId },
          priority: SpecialtyPriority.PRIMARY,
        },
      });
      if (primary)
        throw new ConflictException(
          'The health professional already has a primary specialty',
        );
    }
    try {
      return await this.dataSource.transaction(async (manager) => {
        const assignments = manager.getRepository(ProfessionalSpecialty);
        const saved = await assignments.save(
          assignments.create({
            healthProfessional: professional,
            specialty,
            priority: dto.priority,
          }),
        );
        return HealthProfessionalMapper.toSpecialtyResponseDto(
          await this.findSpecialtyAssignmentOrThrow(
            professionalId,
            saved.professionalSpecialityId,
          ),
        );
      });
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        HEALTH_PROFESSIONAL_CONSTRAINT_MAP,
      );
    }
  }

  async removeSpecialty(
    professionalId: number,
    professionalSpecialtyId: number,
  ): Promise<void> {
    const assignment = await this.findSpecialtyAssignmentOrThrow(
      professionalId,
      professionalSpecialtyId,
    );
    await this.professionalSpecialtyRepository.remove(assignment);
  }

  private professionalQuery() {
    return this.professionalRepository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.employee', 'employee');
  }

  private specialtyQuery() {
    return this.professionalSpecialtyRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.healthProfessional', 'professional')
      .leftJoinAndSelect('assignment.specialty', 'specialty');
  }

  private async findByIdOrThrow(id: number): Promise<HealthProfessional> {
    const professional = await this.professionalQuery()
      .where('professional.healthProfessionalId = :id', { id })
      .getOne();
    if (!professional)
      throw new NotFoundException(
        `Health professional with id ${id} not found`,
      );
    return professional;
  }

  private async findEmployeeOrThrow(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({
      employeeId: id,
    });
    if (!employee)
      throw new NotFoundException(`Employee with id ${id} not found`);
    return employee;
  }

  private async findSpecialtyOrThrow(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOneBy({
      specialtyId: id,
      status: SpecialtyStatus.ACTIVE,
    });
    if (!specialty)
      throw new NotFoundException(`Active specialty with id ${id} not found`);
    return specialty;
  }

  private async findSpecialtyAssignmentOrThrow(
    professionalId: number,
    assignmentId: number,
  ): Promise<ProfessionalSpecialty> {
    const assignment = await this.specialtyQuery()
      .where('assignment.professionalSpecialityId = :assignmentId', {
        assignmentId,
      })
      .andWhere('professional.healthProfessionalId = :professionalId', {
        professionalId,
      })
      .getOne();
    if (!assignment)
      throw new NotFoundException(
        `Professional specialty assignment with id ${assignmentId} not found`,
      );
    return assignment;
  }

  private async ensureLicenseAvailable(
    professionalLicense: string,
    excludeId?: number,
  ): Promise<void> {
    const query = this.professionalRepository
      .createQueryBuilder('professional')
      .where('professional.professionalLicense = :professionalLicense', {
        professionalLicense,
      });
    if (excludeId)
      query.andWhere('professional.health_professional_id != :excludeId', {
        excludeId,
      });
    if (await query.getExists())
      throw new ConflictException(
        `Professional license ${professionalLicense} is already in use`,
      );
  }
}
