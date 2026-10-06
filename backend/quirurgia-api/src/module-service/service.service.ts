import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Area } from '../module-area/entity/area.entity';
import { AreaStatus } from '../module-area/enum/area-status.enum';
import { Branch } from '../module-branch/entity/branch.entity';
import { BranchStatus } from '../module-branch/enum/branch-status.enum';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { ConsultingRoomStatus } from '../module-consulting-room/enum/consulting-room-status.enum';
import { EmployeeAssignment } from '../module-employee/entity/employee-assignment.entity';
import { EmployeeAssignmentStatus } from '../module-employee/enum/employee-assignment-status.enum';
import { EmployeeStatus } from '../module-employee/enum/employee-status.enum';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { HealthProfessionalStatus } from '../module-health-professional/enum/health-professional-status.enum';
import { ServiceCategory } from '../module-service-category/entity/service-category.entity';
import { ServiceCategoryStatus } from '../module-service-category/enum/service-category-status.enum';
import { SERVICE_CONSTRAINT_MAP } from './const/service.constraint';
import { CreateServiceAssignmentDto } from './dto/request/create-service-assignment.dto';
import { CreateServiceRequirementDto } from './dto/request/create-service-requirement.dto';
import { CreateServiceDto } from './dto/request/create-service.dto';
import { FindServiceQueryDto } from './dto/request/find-service-query.dto';
import { UpdateServiceAssignmentDto } from './dto/request/update-service-assignment.dto';
import { UpdateServiceRequirementDto } from './dto/request/update-service-requirement.dto';
import { UpdateServiceDto } from './dto/request/update-service.dto';
import { ServiceMapper } from './dto/service.mapper';
import { ServiceAssignmentResponseDto } from './dto/response/service-assignment-response.dto';
import { ServiceRequirementResponseDto } from './dto/response/service-requirement-response.dto';
import { ServiceResponseDto } from './dto/response/service-response.dto';
import { ServiceAssignment } from './entity/service-assignment.entity';
import { ServiceRequirement } from './entity/service-requirement.entity';
import { Service } from './entity/service.entity';
import { ServiceAssignmentStatus } from './enum/service-assignment-status.enum';
import { ServiceRequirementStatus } from './enum/service-requirement-status.enum';
import { ServiceStatus } from './enum/service-status.enum';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceRequirement) private readonly requirementRepository: Repository<ServiceRequirement>,
    @InjectRepository(ServiceAssignment) private readonly assignmentRepository: Repository<ServiceAssignment>,
    @InjectRepository(ServiceCategory) private readonly categoryRepository: Repository<ServiceCategory>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
    @InjectRepository(ConsultingRoom) private readonly roomRepository: Repository<ConsultingRoom>,
    @InjectRepository(HealthProfessional) private readonly professionalRepository: Repository<HealthProfessional>,
    @InjectRepository(EmployeeAssignment) private readonly employeeAssignmentRepository: Repository<EmployeeAssignment>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(filters: FindServiceQueryDto = {}): Promise<OffsetPaginatedResult<ServiceResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.serviceQuery().orderBy('service.name', 'ASC');
    if (filters.categoryId) query.andWhere('category.serviceCategoryId = :categoryId', { categoryId: filters.categoryId });
    if (filters.code) query.andWhere('service.code ILIKE :code', { code: `%${filters.code}%` });
    if (filters.name) query.andWhere('service.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.schedulingType) query.andWhere('service.schedulingType = :schedulingType', { schedulingType: filters.schedulingType });
    if (filters.status) query.andWhere('service.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(ServiceMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async findOne(id: number): Promise<ServiceResponseDto> {
    return ServiceMapper.toResponseDto(await this.findServiceOrThrow(id));
  }

  async create(dto: CreateServiceDto): Promise<ServiceResponseDto> {
    const category = await this.findCategoryOrThrow(dto.categoryId);
    await this.ensureServiceCodeAvailable(dto.code);
    try {
      return ServiceMapper.toResponseDto(await this.serviceRepository.save(this.serviceRepository.create({
        category,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        durationMinutes: dto.durationMinutes,
        schedulingType: dto.schedulingType,
        status: ServiceStatus.ACTIVE,
      })));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SERVICE_CONSTRAINT_MAP);
    }
  }

  async update(id: number, dto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.findServiceOrThrow(id);
    const category = dto.categoryId === undefined ? service.category : await this.findCategoryOrThrow(dto.categoryId);
    const status = dto.status ?? service.status;
    if (status === ServiceStatus.ACTIVE && category.status !== ServiceCategoryStatus.ACTIVE) {
      throw new BadRequestException('An active service requires an active category');
    }
    if (dto.code && dto.code !== service.code) await this.ensureServiceCodeAvailable(dto.code, id);
    service.category = category;
    if (dto.code !== undefined) service.code = dto.code;
    if (dto.name !== undefined) service.name = dto.name;
    if (dto.description !== undefined) service.description = dto.description;
    if (dto.durationMinutes !== undefined) service.durationMinutes = dto.durationMinutes;
    if (dto.schedulingType !== undefined) service.schedulingType = dto.schedulingType;
    if (dto.status !== undefined) service.status = dto.status;
    try {
      return ServiceMapper.toResponseDto(await this.serviceRepository.save(service));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SERVICE_CONSTRAINT_MAP);
    }
  }

  async remove(id: number): Promise<void> {
    const service = await this.findServiceOrThrow(id);
    if (service.status === ServiceStatus.DISCONTINUED) return;
    service.status = ServiceStatus.DISCONTINUED;
    await this.serviceRepository.save(service);
  }

  async findRequirements(serviceId: number): Promise<ServiceRequirementResponseDto[]> {
    await this.findServiceOrThrow(serviceId);
    const requirements = await this.requirementQuery()
      .where('service.serviceId = :serviceId', { serviceId })
      .orderBy('requirement.sortOrder', 'ASC')
      .getMany();
    return requirements.map(ServiceMapper.toRequirementResponseDto);
  }

  async createRequirement(serviceId: number, dto: CreateServiceRequirementDto): Promise<ServiceRequirementResponseDto> {
    const service = await this.findServiceOrThrow(serviceId);
    await this.ensureRequirementAvailable(serviceId, dto.name, dto.sortOrder);
    try {
      const requirement = await this.requirementRepository.save(this.requirementRepository.create({
        service,
        name: dto.name,
        description: dto.description,
        requirementLevel: dto.requirementLevel,
        sortOrder: dto.sortOrder,
        status: ServiceRequirementStatus.ACTIVE,
      }));
      return ServiceMapper.toRequirementResponseDto(await this.findRequirementOrThrow(serviceId, requirement.serviceRequirementId));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SERVICE_CONSTRAINT_MAP);
    }
  }

  async updateRequirement(serviceId: number, requirementId: number, dto: UpdateServiceRequirementDto): Promise<ServiceRequirementResponseDto> {
    const requirement = await this.findRequirementOrThrow(serviceId, requirementId);
    const name = dto.name ?? requirement.name;
    const sortOrder = dto.sortOrder ?? requirement.sortOrder;
    if (name !== requirement.name || sortOrder !== requirement.sortOrder) {
      await this.ensureRequirementAvailable(serviceId, name, sortOrder, requirementId);
    }
    if (dto.name !== undefined) requirement.name = dto.name;
    if (dto.description !== undefined) requirement.description = dto.description;
    if (dto.requirementLevel !== undefined) requirement.requirementLevel = dto.requirementLevel;
    if (dto.sortOrder !== undefined) requirement.sortOrder = dto.sortOrder;
    if (dto.status !== undefined) requirement.status = dto.status;
    try {
      return ServiceMapper.toRequirementResponseDto(await this.requirementRepository.save(requirement));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SERVICE_CONSTRAINT_MAP);
    }
  }

  async findAssignments(serviceId: number): Promise<ServiceAssignmentResponseDto[]> {
    await this.findServiceOrThrow(serviceId);
    const assignments = await this.assignmentQuery()
      .where('service.serviceId = :serviceId', { serviceId })
      .orderBy('assignment.createdAt', 'DESC')
      .getMany();
    return assignments.map(ServiceMapper.toAssignmentResponseDto);
  }

  async createAssignment(serviceId: number, dto: CreateServiceAssignmentDto): Promise<ServiceAssignmentResponseDto> {
    const service = await this.findServiceOrThrow(serviceId);
    const context = await this.resolveAssignmentContext(dto.branchId, dto.areaId ?? null, dto.consultingRoomId ?? null, dto.healthProfessionalId ?? null);
    this.ensureActiveAssignmentEligible(service, context);
    const assignment = await this.assignmentRepository.save(this.assignmentRepository.create({
      service,
      branch: context.branch,
      area: context.area,
      consultingRoom: context.room,
      healthProfessional: context.professional,
      status: ServiceAssignmentStatus.ACTIVE,
    }));
    return ServiceMapper.toAssignmentResponseDto(await this.findAssignmentOrThrow(serviceId, assignment.serviceAssignmentId));
  }

  async updateAssignment(serviceId: number, assignmentId: number, dto: UpdateServiceAssignmentDto): Promise<ServiceAssignmentResponseDto> {
    const assignment = await this.findAssignmentOrThrow(serviceId, assignmentId);
    const context = await this.resolveAssignmentContext(
      dto.branchId ?? assignment.branch.branchId,
      dto.areaId === undefined ? assignment.area?.areaId ?? null : dto.areaId,
      dto.consultingRoomId === undefined ? assignment.consultingRoom?.consultingRoomId ?? null : dto.consultingRoomId,
      dto.healthProfessionalId === undefined ? assignment.healthProfessional?.healthProfessionalId ?? null : dto.healthProfessionalId,
    );
    const status = dto.status ?? assignment.status;
    if (status === ServiceAssignmentStatus.ACTIVE) this.ensureActiveAssignmentEligible(assignment.service, context);
    assignment.branch = context.branch;
    assignment.area = context.area;
    assignment.consultingRoom = context.room;
    assignment.healthProfessional = context.professional;
    assignment.status = status;
    return ServiceMapper.toAssignmentResponseDto(await this.assignmentRepository.save(assignment));
  }

  async removeAssignment(serviceId: number, assignmentId: number): Promise<void> {
    const assignment = await this.findAssignmentOrThrow(serviceId, assignmentId);
    if (assignment.status === ServiceAssignmentStatus.INACTIVE) return;
    assignment.status = ServiceAssignmentStatus.INACTIVE;
    await this.assignmentRepository.save(assignment);
  }

  private serviceQuery() {
    return this.serviceRepository.createQueryBuilder('service').leftJoinAndSelect('service.category', 'category');
  }

  private requirementQuery() {
    return this.requirementRepository.createQueryBuilder('requirement').leftJoinAndSelect('requirement.service', 'service');
  }

  private assignmentQuery() {
    return this.assignmentRepository.createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.service', 'service')
      .leftJoinAndSelect('assignment.branch', 'branch')
      .leftJoinAndSelect('assignment.area', 'area')
      .leftJoinAndSelect('assignment.consultingRoom', 'consultingRoom')
      .leftJoinAndSelect('assignment.healthProfessional', 'healthProfessional');
  }

  private async findServiceOrThrow(id: number): Promise<Service> {
    const service = await this.serviceQuery().where('service.serviceId = :id', { id }).getOne();
    if (!service) throw new NotFoundException(`Service with id ${id} not found`);
    return service;
  }

  private async findCategoryOrThrow(id: number): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOneBy({ serviceCategoryId: id });
    if (!category) throw new NotFoundException(`Service category with id ${id} not found`);
    return category;
  }

  private async findRequirementOrThrow(serviceId: number, requirementId: number): Promise<ServiceRequirement> {
    const requirement = await this.requirementQuery()
      .where('requirement.serviceRequirementId = :requirementId', { requirementId })
      .andWhere('service.serviceId = :serviceId', { serviceId })
      .getOne();
    if (!requirement) throw new NotFoundException(`Service requirement with id ${requirementId} not found`);
    return requirement;
  }

  private async findAssignmentOrThrow(serviceId: number, assignmentId: number): Promise<ServiceAssignment> {
    const assignment = await this.assignmentQuery()
      .where('assignment.serviceAssignmentId = :assignmentId', { assignmentId })
      .andWhere('service.serviceId = :serviceId', { serviceId })
      .getOne();
    if (!assignment) throw new NotFoundException(`Service assignment with id ${assignmentId} not found`);
    return assignment;
  }

  private async ensureServiceCodeAvailable(code: string, excludeId?: number): Promise<void> {
    const query = this.serviceRepository.createQueryBuilder('service').where('service.code = :code', { code });
    if (excludeId) query.andWhere('service.service_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException(`Service code ${code} is already in use`);
  }

  private async ensureRequirementAvailable(serviceId: number, name: string, sortOrder: number, excludeId?: number): Promise<void> {
    const nameQuery = this.requirementRepository.createQueryBuilder('requirement')
      .where('requirement.service_id = :serviceId', { serviceId })
      .andWhere('requirement.name = :name', { name });
    const orderQuery = this.requirementRepository.createQueryBuilder('requirement')
      .where('requirement.service_id = :serviceId', { serviceId })
      .andWhere('requirement.sort_order = :sortOrder', { sortOrder });
    if (excludeId) {
      nameQuery.andWhere('requirement.service_requirement_id != :excludeId', { excludeId });
      orderQuery.andWhere('requirement.service_requirement_id != :excludeId', { excludeId });
    }
    if (await nameQuery.getExists()) throw new ConflictException(`Service requirement name ${name} is already in use`);
    if (await orderQuery.getExists()) throw new ConflictException(`Service requirement sortOrder ${sortOrder} is already in use`);
  }

  private async resolveAssignmentContext(branchId: number, areaId: number | null, roomId: number | null, professionalId: number | null) {
    const [branch, area, room, professional] = await Promise.all([
      this.branchRepository.findOneBy({ branchId }),
      areaId ? this.areaRepository.findOne({ where: { areaId }, relations: { branch: true } }) : Promise.resolve(null),
      roomId ? this.roomRepository.findOne({ where: { consultingRoomId: roomId }, relations: { branch: true, area: true } }) : Promise.resolve(null),
      professionalId ? this.professionalRepository.findOne({ where: { healthProfessionalId: professionalId }, relations: { employee: true } }) : Promise.resolve(null),
    ]);
    if (!branch) throw new NotFoundException(`Branch with id ${branchId} not found`);
    if (areaId && !area) throw new NotFoundException(`Area with id ${areaId} not found`);
    if (roomId && !room) throw new NotFoundException(`Consulting room with id ${roomId} not found`);
    if (professionalId && !professional) throw new NotFoundException(`Health professional with id ${professionalId} not found`);
    if (area && area.branch.branchId !== branchId) throw new BadRequestException('The assignment area must belong to the same branch');
    if (room && room.branch.branchId !== branchId) throw new BadRequestException('The assignment consulting room must belong to the same branch');
    if (area && room?.area?.areaId !== area.areaId) throw new BadRequestException('The consulting room must belong to the assigned area');
    if (professional) {
      const eligible = await this.employeeAssignmentRepository.exists({
        where: { employee: { employeeId: professional.employee.employeeId }, branch: { branchId }, status: EmployeeAssignmentStatus.ACTIVE },
      });
      if (!eligible) throw new BadRequestException('The health professional must have an active assignment in this branch');
    }
    return { branch, area, room, professional };
  }

  private ensureActiveAssignmentEligible(service: Service, context: Awaited<ReturnType<ServiceService['resolveAssignmentContext']>>): void {
    if (service.status !== ServiceStatus.ACTIVE) throw new BadRequestException('Only an active service can have an active assignment');
    if (service.category.status !== ServiceCategoryStatus.ACTIVE) throw new BadRequestException('An active assignment requires an active service category');
    if (context.branch.status !== BranchStatus.ACTIVE) throw new BadRequestException('An active assignment requires an active branch');
    if (context.area && context.area.status !== AreaStatus.ACTIVE) throw new BadRequestException('An active assignment requires an active area');
    if (context.room && context.room.status !== ConsultingRoomStatus.AVAILABLE) throw new BadRequestException('An active assignment requires an available consulting room');
    if (context.professional && (context.professional.status !== HealthProfessionalStatus.ACTIVE || context.professional.employee.status !== EmployeeStatus.ACTIVE)) {
      throw new BadRequestException('An active assignment requires an active health professional and employee');
    }
  }
}
