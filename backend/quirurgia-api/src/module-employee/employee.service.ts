import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Area } from '../module-area/entity/area.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { Person } from '../module-person/entity/person.entity';
import { Position } from '../module-position/entity/position.entity';
import { PositionStatus } from '../module-position/enum/position-status.enum';
import { EMPLOYEE_CONSTRAINT_MAP } from './const/employee.constraint';
import { CreateEmployeeDto } from './dto/request/create-employee.dto';
import { CreateEmployeeAssignmentDto } from './dto/request/create-employee-assignment.dto';
import { EndEmployeeAssignmentDto } from './dto/request/end-employee-assignment.dto';
import { FindEmployeeQueryDto } from './dto/request/find-employee-query.dto';
import { UpdateEmployeeDto } from './dto/request/update-employee.dto';
import { EmployeeMapper } from './dto/employee.mapper';
import { EmployeeAssignmentResponseDto } from './dto/response/employee-assignment-response.dto';
import { EmployeeResponseDto } from './dto/response/employee-response.dto';
import { EmployeeAssignment } from './entity/employee-assignment.entity';
import { Employee } from './entity/employee.entity';
import { AssignmentType } from './enum/assignment-type.enum';
import { EmployeeAssignmentStatus } from './enum/employee-assignment-status.enum';
import { EmployeeStatus } from './enum/employee-status.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeAssignment) private readonly assignmentRepository: Repository<EmployeeAssignment>,
    @InjectRepository(Person) private readonly personRepository: Repository<Person>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
    @InjectRepository(Position) private readonly positionRepository: Repository<Position>,
    private readonly dataSource: DataSource,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(filters: FindEmployeeQueryDto = {}): Promise<OffsetPaginatedResult<EmployeeResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.employeeQuery().orderBy('employee.employeeNumber', 'ASC');
    if (filters.employeeNumber) query.andWhere('employee.employeeNumber ILIKE :employeeNumber', { employeeNumber: `%${filters.employeeNumber}%` });
    if (filters.personName) {
      query.andWhere(new Brackets((where) => {
        where.where('person.firstName ILIKE :personName', { personName: `%${filters.personName}%` })
          .orWhere('person.lastName ILIKE :personName', { personName: `%${filters.personName}%` });
      }));
    }
    if (filters.status) query.andWhere('employee.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(EmployeeMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async findOne(id: number): Promise<EmployeeResponseDto> {
    return EmployeeMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    this.ensureEmploymentDates(dto.hireDate, null, EmployeeStatus.ACTIVE);
    const person = await this.findPersonOrThrow(dto.personId);
    await this.ensureEmployeeNumberAvailable(dto.employeeNumber);
    if (await this.employeeRepository.exists({ where: { person: { personId: person.personId } } })) {
      throw new ConflictException('This person already has an employee profile');
    }
    try {
      return EmployeeMapper.toResponseDto(await this.employeeRepository.save(this.employeeRepository.create({
        person,
        employeeNumber: dto.employeeNumber,
        hireDate: dto.hireDate,
        terminationDate: null,
        status: EmployeeStatus.ACTIVE,
      })));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, EMPLOYEE_CONSTRAINT_MAP);
    }
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.findByIdOrThrow(id);
    const status = dto.status ?? employee.status;
    const hireDate = dto.hireDate ?? employee.hireDate;
    const terminationDate = dto.terminationDate === undefined ? employee.terminationDate : dto.terminationDate;
    this.ensureEmploymentDates(hireDate, terminationDate, status);
    if (employee.status === EmployeeStatus.TERMINATED && status !== EmployeeStatus.TERMINATED) {
      throw new BadRequestException('A terminated employee cannot be reactivated; create a rehire flow instead');
    }
    if (dto.employeeNumber && dto.employeeNumber !== employee.employeeNumber) {
      await this.ensureEmployeeNumberAvailable(dto.employeeNumber, id);
    }
    try {
      return await this.dataSource.transaction(async (manager) => {
        const employees = manager.getRepository(Employee);
        const assignments = manager.getRepository(EmployeeAssignment);
        const updated = employees.merge(employee, dto);
        const saved = await employees.save(updated);
        if (status === EmployeeStatus.TERMINATED && employee.status !== EmployeeStatus.TERMINATED) {
          await assignments.createQueryBuilder()
            .update(EmployeeAssignment)
            .set({ status: EmployeeAssignmentStatus.ENDED, endDate: terminationDate })
            .where('employee_id = :employeeId', { employeeId: id })
            .andWhere('status = :assignmentStatus', { assignmentStatus: EmployeeAssignmentStatus.ACTIVE })
            .execute();
        }
        return EmployeeMapper.toResponseDto(saved);
      });
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, EMPLOYEE_CONSTRAINT_MAP);
    }
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findByIdOrThrow(id);
    if (employee.status === EmployeeStatus.TERMINATED) return;
    const terminationDate = new Date().toISOString().slice(0, 10);
    await this.update(id, { status: EmployeeStatus.TERMINATED, terminationDate });
  }

  async findAssignments(employeeId: number): Promise<EmployeeAssignmentResponseDto[]> {
    await this.findByIdOrThrow(employeeId);
    const assignments = await this.assignmentQuery()
      .where('employee.employeeId = :employeeId', { employeeId })
      .orderBy('assignment.startDate', 'DESC')
      .getMany();
    return assignments.map(EmployeeMapper.toAssignmentResponseDto);
  }

  async assign(employeeId: number, dto: CreateEmployeeAssignmentDto): Promise<EmployeeAssignmentResponseDto> {
    const employee = await this.findByIdOrThrow(employeeId);
    if (employee.status === EmployeeStatus.TERMINATED) throw new BadRequestException('Cannot assign a terminated employee');
    const [branch, area, position] = await Promise.all([
      this.findBranchOrThrow(dto.branchId),
      dto.areaId ? this.findAreaOrThrow(dto.areaId) : Promise.resolve(null),
      this.findPositionOrThrow(dto.positionId),
    ]);
    if (area && area.branch.branchId !== branch.branchId) {
      throw new BadRequestException('The assignment area must belong to the same branch');
    }
    if (dto.assignmentType === AssignmentType.PRIMARY) {
      const existingPrimary = await this.assignmentRepository.exists({
        where: {
          employee: { employeeId },
          assignmentType: AssignmentType.PRIMARY,
          status: EmployeeAssignmentStatus.ACTIVE,
        },
      });
      if (existingPrimary) throw new ConflictException('The employee already has an active primary assignment');
    }
    try {
      const assignment = await this.assignmentRepository.save(this.assignmentRepository.create({
        employee,
        branch,
        area,
        position,
        assignmentType: dto.assignmentType,
        status: EmployeeAssignmentStatus.ACTIVE,
        startDate: dto.startDate,
        endDate: null,
      }));
      return EmployeeMapper.toAssignmentResponseDto(await this.findAssignmentOrThrow(employeeId, assignment.employeeAssignmentId));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, EMPLOYEE_CONSTRAINT_MAP);
    }
  }

  async endAssignment(employeeId: number, assignmentId: number, dto: EndEmployeeAssignmentDto): Promise<void> {
    const assignment = await this.findAssignmentOrThrow(employeeId, assignmentId);
    if (assignment.status === EmployeeAssignmentStatus.ENDED) return;
    const endDate = dto.endDate ?? new Date().toISOString().slice(0, 10);
    if (new Date(endDate) < new Date(assignment.startDate)) {
      throw new BadRequestException('Assignment endDate cannot be before startDate');
    }
    assignment.status = EmployeeAssignmentStatus.ENDED;
    assignment.endDate = endDate;
    await this.assignmentRepository.save(assignment);
  }

  async findByIdOrThrow(id: number): Promise<Employee> {
    const employee = await this.employeeQuery().where('employee.employeeId = :id', { id }).getOne();
    if (!employee) throw new NotFoundException(`Employee with id ${id} not found`);
    return employee;
  }

  private employeeQuery() {
    return this.employeeRepository.createQueryBuilder('employee').leftJoinAndSelect('employee.person', 'person');
  }

  private assignmentQuery() {
    return this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.employee', 'employee')
      .leftJoinAndSelect('assignment.branch', 'branch')
      .leftJoinAndSelect('assignment.area', 'area')
      .leftJoinAndSelect('assignment.position', 'position');
  }

  private async findPersonOrThrow(id: number): Promise<Person> {
    const person = await this.personRepository.createQueryBuilder('person')
      .where('person.personId = :id', { id })
      .andWhere('person.deleted_at IS NULL')
      .getOne();
    if (!person) throw new NotFoundException(`Person with id ${id} not found`);
    return person;
  }

  private async findBranchOrThrow(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOneBy({ branchId: id });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  private async findAreaOrThrow(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({ where: { areaId: id }, relations: { branch: true } });
    if (!area) throw new NotFoundException(`Area with id ${id} not found`);
    return area;
  }

  private async findPositionOrThrow(id: number): Promise<Position> {
    const position = await this.positionRepository.findOneBy({ positionId: id, status: PositionStatus.ACTIVE });
    if (!position) throw new NotFoundException(`Active position with id ${id} not found`);
    return position;
  }

  private async findAssignmentOrThrow(employeeId: number, assignmentId: number): Promise<EmployeeAssignment> {
    const assignment = await this.assignmentQuery()
      .where('assignment.employeeAssignmentId = :assignmentId', { assignmentId })
      .andWhere('employee.employeeId = :employeeId', { employeeId })
      .getOne();
    if (!assignment) throw new NotFoundException(`Employee assignment with id ${assignmentId} not found`);
    return assignment;
  }

  private async ensureEmployeeNumberAvailable(employeeNumber: string, excludeId?: number): Promise<void> {
    const query = this.employeeRepository.createQueryBuilder('employee').where('employee.employeeNumber = :employeeNumber', { employeeNumber });
    if (excludeId) query.andWhere('employee.employee_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException(`Employee number ${employeeNumber} is already in use`);
  }

  private ensureEmploymentDates(hireDate: string, terminationDate: string | null, status: EmployeeStatus): void {
    if (Number.isNaN(new Date(hireDate).valueOf()) || (terminationDate !== null && Number.isNaN(new Date(terminationDate).valueOf()))) {
      throw new BadRequestException('Invalid employment date');
    }
    if (terminationDate !== null && new Date(terminationDate) < new Date(hireDate)) {
      throw new BadRequestException('terminationDate cannot be before hireDate');
    }
    if (status === EmployeeStatus.TERMINATED && !terminationDate) {
      throw new BadRequestException('A terminated employee must have a terminationDate');
    }
    if (status !== EmployeeStatus.TERMINATED && terminationDate !== null) {
      throw new BadRequestException('Only a terminated employee can have a terminationDate');
    }
  }
}
