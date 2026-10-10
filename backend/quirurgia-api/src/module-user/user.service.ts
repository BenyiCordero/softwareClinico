import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { EmailAlreadyInUseException } from '../module-auth/errors/email-already-in-use.exception';
import { Branch } from '../module-branch/entity/branch.entity';
import { Permission } from '../module-permission/entity/permission.entity';
import { PermissionStatus } from '../module-permission/enum/permission-status.enum';
import { Person } from '../module-person/entity/person.entity';
import { Role } from '../module-role/entity/role.entity';
import { RoleStatus } from '../module-role/enum/role-status.enum';
import { AuthorizationService } from './authorization.service';
import { AssignUserRoleDto } from './dto/request/assign-user-role.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { ChangeStatusDto } from './dto/request/change-status.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { CreateUserPermissionOverrideDto } from './dto/request/create-user-permission-override.dto';
import { FindUserQueryDto } from './dto/request/find-user-query.dto';
import { UserUpdateDto } from './dto/request/user-update.dto';
import { UserMapper } from './dto/mapper/user.mapper';
import { UserResponseDto } from './dto/response/user-response.dto';
import { User } from './entity/user.entity';
import { UserPermissionOverride } from './entity/user-permission-override.entity';
import { UserRole } from './entity/user-role.entity';
import { PermissionOverrideStatus } from './enum/permission-override-status.enum';
import { UserRoleStatus } from './enum/user-role-status.enum';
import { UserStatus } from './enum/user-status.enum';
import { SelfDisableForbiddenException } from './exception/self-disable-forbidden.exception';
import { UserNotFoundException } from './exception/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPermissionOverride)
    private readonly overrideRepository: Repository<UserPermissionOverride>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly authorizationService: AuthorizationService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  async findAll(
    filters: FindUserQueryDto = {},
  ): Promise<OffsetPaginatedResult<UserResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.userQuery()
      .orderBy('user.createdAt', 'ASC')
      .addOrderBy('user.userId', 'ASC');
    if (filters.status)
      query.andWhere('user.status = :status', { status: filters.status });
    if (filters.roleId)
      query.andWhere('userRole.role_id = :roleId', { roleId: filters.roleId });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      data: entities.map((entity) => UserMapper.toResponseDto(entity)),
      pagination: {
        type: PaginationEnum.OFFSET,
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    return UserMapper.toResponseDto(await this.findUserOrThrowById(id));
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());
    const validFrom = new Date();
    const user = await this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const persons = manager.getRepository(Person);
      const roles = manager.getRepository(Role);
      const branches = manager.getRepository(Branch);
      const userRoles = manager.getRepository(UserRole);

      const [existingEmail, existingUsername, person, role, branch] =
        await Promise.all([
          users.findOneBy({ email: dto.email }),
          users.findOneBy({ username: dto.username }),
          persons.findOneBy({ personId: dto.personId }),
          roles.findOneBy({ roleId: dto.roleId, status: RoleStatus.ACTIVE }),
          dto.branchId
            ? branches.findOneBy({ branchId: dto.branchId })
            : Promise.resolve(null),
        ]);
      if (existingEmail) throw new EmailAlreadyInUseException(dto.email);
      if (existingUsername)
        throw new ConflictException('Username is already taken');
      if (!person)
        throw new NotFoundException(`Person with id ${dto.personId} not found`);
      if (!role)
        throw new NotFoundException(
          `Active role with id ${dto.roleId} not found`,
        );
      if (dto.branchId && !branch)
        throw new NotFoundException(`Branch with id ${dto.branchId} not found`);

      const created = await users.save(
        users.create({
          username: dto.username,
          email: dto.email,
          passwordHash,
          person,
          status: UserStatus.ACTIVE,
          deletedAt: null,
        }),
      );
      await userRoles.save(
        userRoles.create({
          user: created,
          role,
          branch: branch ?? null,
          status: UserRoleStatus.ACTIVE,
          validFrom,
          validUntil: null,
        }),
      );
      return created;
    });
    this.eventEmitter.emit('user.authorizationChanged', user.userId);
    return this.findOne(user.userId);
  }

  async update(id: number, dto: UserUpdateDto): Promise<UserResponseDto> {
    const user = await this.findUserOrThrowById(id);
    if (!user.person)
      throw new BadRequestException('This user is not linked to a person');
    const changed =
      (dto.firstName !== undefined &&
        user.person.firstName !== dto.firstName) ||
      (dto.middleName !== undefined &&
        user.person.middleName !== dto.middleName) ||
      (dto.lastName !== undefined && user.person.lastName !== dto.lastName);
    if (!changed) return UserMapper.toResponseDto(user);
    await this.personRepository.save(
      this.personRepository.merge(user.person, dto),
    );
    return this.findOne(id);
  }

  async changeStatus(
    id: number,
    dto: ChangeStatusDto,
    requesterId: number,
  ): Promise<UserResponseDto> {
    if (id === requesterId) throw new SelfDisableForbiddenException();
    const user = await this.findUserOrThrowById(id);
    if (user.status === dto.status) return UserMapper.toResponseDto(user);
    user.status = dto.status;
    await this.userRepository.save(user);
    this.eventEmitter.emit(
      dto.status === UserStatus.DISABLED
        ? 'user.disabled'
        : 'user.authorizationChanged',
      user.userId,
    );
    return this.findOne(id);
  }

  async changePassword(
    id: number,
    dto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.findUserOrThrowById(id);
    user.passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds());
    await this.userRepository.save(user);
    this.eventEmitter.emit('user.passwordChanged', user.userId);
    return this.findOne(id);
  }

  async assignRole(
    userId: number,
    dto: AssignUserRoleDto,
  ): Promise<UserResponseDto> {
    const validFrom = dto.validFrom ?? new Date();
    const validUntil = dto.validUntil ?? null;
    this.ensureDateRange(validFrom, validUntil);
    const [user, role, branch] = await Promise.all([
      this.findUserOrThrowById(userId),
      this.roleRepository.findOneBy({
        roleId: dto.roleId,
        status: RoleStatus.ACTIVE,
      }),
      dto.branchId
        ? this.branchRepository.findOneBy({ branchId: dto.branchId })
        : Promise.resolve(null),
    ]);
    if (!role)
      throw new NotFoundException(
        `Active role with id ${dto.roleId} not found`,
      );
    if (dto.branchId && !branch)
      throw new NotFoundException(`Branch with id ${dto.branchId} not found`);

    const duplicate = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .where('userRole.user_id = :userId', { userId })
      .andWhere('userRole.role_id = :roleId', { roleId: dto.roleId })
      .andWhere(
        dto.branchId
          ? 'userRole.branch_id = :branchId'
          : 'userRole.branch_id IS NULL',
        {
          branchId: dto.branchId,
        },
      )
      .andWhere('userRole.status = :status', { status: UserRoleStatus.ACTIVE })
      .getOne();
    if (duplicate)
      throw new ConflictException(
        'The user already has this active role in this scope',
      );

    await this.userRoleRepository.save(
      this.userRoleRepository.create({
        user,
        role,
        branch: branch ?? null,
        status: UserRoleStatus.ACTIVE,
        validFrom,
        validUntil,
      }),
    );
    this.eventEmitter.emit('user.authorizationChanged', userId);
    return this.findOne(userId);
  }

  async revokeRole(userId: number, userRoleId: number): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userRoleId, user: { userId } },
    });
    if (!userRole)
      throw new NotFoundException(
        `Role assignment with id ${userRoleId} not found`,
      );
    if (userRole.status !== UserRoleStatus.REVOKED) {
      userRole.status = UserRoleStatus.REVOKED;
      await this.userRoleRepository.save(userRole);
      this.eventEmitter.emit('user.authorizationChanged', userId);
    }
  }

  async createPermissionOverride(
    userId: number,
    dto: CreateUserPermissionOverrideDto,
    createdBy: number,
  ): Promise<void> {
    const validFrom = dto.validFrom ?? new Date();
    const validUntil = dto.validUntil ?? null;
    this.ensureDateRange(validFrom, validUntil);
    const [user, permission, branch] = await Promise.all([
      this.findUserOrThrowById(userId),
      this.permissionRepository.findOneBy({
        permissionId: dto.permissionId,
        status: PermissionStatus.ACTIVE,
      }),
      dto.branchId
        ? this.branchRepository.findOneBy({ branchId: dto.branchId })
        : Promise.resolve(null),
    ]);
    if (!permission)
      throw new NotFoundException(
        `Active permission with id ${dto.permissionId} not found`,
      );
    if (dto.branchId && !branch)
      throw new NotFoundException(`Branch with id ${dto.branchId} not found`);

    const existing = await this.overrideRepository
      .createQueryBuilder('override')
      .where('override.user_id = :userId', { userId })
      .andWhere('override.permission_id = :permissionId', {
        permissionId: dto.permissionId,
      })
      .andWhere(
        dto.branchId
          ? 'override.branch_id = :branchId'
          : 'override.branch_id IS NULL',
        {
          branchId: dto.branchId,
        },
      )
      .andWhere('override.status = :status', {
        status: PermissionOverrideStatus.ACTIVE,
      })
      .getOne();
    if (existing)
      throw new ConflictException(
        'The user already has an active override for this permission',
      );

    await this.overrideRepository.save(
      this.overrideRepository.create({
        user,
        permission,
        branch: branch ?? null,
        effect: dto.effect,
        status: PermissionOverrideStatus.ACTIVE,
        reason: dto.reason ?? null,
        validFrom,
        validUntil,
        createdBy,
      }),
    );
    this.eventEmitter.emit('user.authorizationChanged', userId);
  }

  async revokePermissionOverride(
    userId: number,
    overrideId: number,
  ): Promise<void> {
    const override = await this.overrideRepository.findOne({
      where: { userPermissionOverrideId: overrideId, user: { userId } },
    });
    if (!override)
      throw new NotFoundException(
        `Permission override with id ${overrideId} not found`,
      );
    if (override.status !== PermissionOverrideStatus.REVOKED) {
      override.status = PermissionOverrideStatus.REVOKED;
      await this.overrideRepository.save(override);
      this.eventEmitter.emit('user.authorizationChanged', userId);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ userId: id });
  }

  async findUserOrThrowById(id: number): Promise<User> {
    const user = await this.userQuery()
      .where('user.userId = :id', { id })
      .getOne();
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  private userQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.person', 'person')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('userRole.branch', 'branch');
  }

  private saltRounds(): number {
    return Number(this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS'));
  }

  private ensureDateRange(validFrom: Date, validUntil: Date | null): void {
    if (
      Number.isNaN(validFrom.valueOf()) ||
      (validUntil !== null && Number.isNaN(validUntil.valueOf()))
    ) {
      throw new BadRequestException('Invalid validity window');
    }
    if (validUntil !== null && validFrom >= validUntil) {
      throw new BadRequestException('validUntil must be after validFrom');
    }
  }
}
