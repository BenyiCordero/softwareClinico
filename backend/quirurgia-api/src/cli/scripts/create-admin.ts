import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { CliModule } from '../cli.module';
import { UserService } from '../../module-user/user.service';
import { CreateUserDto } from '../../module-user/dto/request/create-user.dto';
import { Role } from '../../module-role/entity/role.entity';
import { RoleType } from '../../module-role/enum/role-type.enum';
import { RoleStatus } from '../../module-role/enum/role-status.enum';
import { Person } from '../../module-person/entity/person.entity';
import { Sex } from '../../module-person/enum/sex.enum';
import { PermissionService } from '../../module-permission/permission.service';
import { PermissionResource } from '../../module-permission/enum/permission-resource.enum';
import { PermissionAction } from '../../module-permission/enum/permission-action.enum';
import { CreatePermissionDto } from '../../module-permission/dto/request/create-permission.dto';
import { RolePermissionService } from '../../module-role/role-permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const ADMIN_ROLE_NAME = 'admin';

const initialPermissions: CreatePermissionDto[] = [
  {
    resource: PermissionResource.USERS,
    action: PermissionAction.MANAGE,
    description: 'Allows managing users',
  },
  {
    resource: PermissionResource.USERS,
    action: PermissionAction.READ,
    description: 'Allows reading users',
  },
  {
    resource: PermissionResource.PAYMENT_METHODS,
    action: PermissionAction.MANAGE,
    description: 'Allows managing payment methods',
  },
  {
    resource: PermissionResource.PAYMENT_METHODS,
    action: PermissionAction.READ,
    description: 'Allows reading payment methods',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);

  try {
    const configService = app.get(ConfigService);
    const logger = await app.resolve(PinoLogger);
    const userService = app.get(UserService);
    const permissionService = app.get(PermissionService);
    const rolePermissionService = app.get(RolePermissionService);
    const roleRepository = app.get<Repository<Role>>(
      getRepositoryToken(Role),
    );
    const personRepository = app.get<Repository<Person>>(
      getRepositoryToken(Person),
    );

    const email = configService.get<string>('ADMIN_EMAIL')?.trim().toLowerCase();
    const password = configService.get<string>('ADMIN_PASSWORD');
    const username = configService.get<string>('ADMIN_USERNAME')?.trim().toLowerCase() ?? email?.split('@')[0];
    const firstName = configService.get<string>('ADMIN_FIRST_NAME');
    const lastName = configService.get<string>('ADMIN_LAST_NAME');
    const birthDate = configService.get<string>('ADMIN_BIRTH_DATE');
    const sex = configService.get<Sex>('ADMIN_SEX');
    const phone = configService.get<string>('ADMIN_PHONE');
    const branchIdValue = configService.get<string>('ADMIN_BRANCH_ID');
    const branchId = branchIdValue ? Number(branchIdValue) : undefined;

    if (!email || !password || !username || !firstName || !lastName || !birthDate || !sex || !phone) {
      throw new Error(
        'Missing admin environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_BIRTH_DATE, ADMIN_SEX, ADMIN_PHONE',
      );
    }

    let role = await roleRepository.findOneBy({ name: ADMIN_ROLE_NAME });

    if (!role) {
      role = await roleRepository.save(
        roleRepository.create({
          name: ADMIN_ROLE_NAME,
          description: 'System administrator with full initial access',
          type: RoleType.SYSTEM,
          status: RoleStatus.ACTIVE,
        }),
      );
      logger.info({ roleId: role.roleId }, 'Administrator role created');
    }

    const permissions = await permissionService.createManyIfNotExists(initialPermissions);

    await rolePermissionService.createManyIfNotExists(
      role.roleId,
      permissions.map(({ permissionId }) => permissionId),
    );

    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      logger.warn(
        { userId: existingUser.userId, roleId: role.roleId },
        'Administrator user already exists; role permissions were ensured',
      );
      return;
    }

    const person = await personRepository.save(
      personRepository.create({
        firstName,
        middleName: null,
        lastName,
        secondLastName: null,
        birthDate,
        sex,
        curp: null,
        rfc: null,
        phone,
        secondaryPhone: null,
        email,
        address: null,
        city: null,
        state: null,
        postalCode: null,
        deletedAt: null,
      }),
    );

    const user = new CreateUserDto();
    user.username = username;
    user.email = email;
    user.password = password;
    user.personId = person.personId;
    user.roleId = role.roleId;
    if (branchId) user.branchId = branchId;

    await userService.create(user);

    logger.info(
      { personId: person.personId, roleId: role.roleId },
      'Administrator created successfully',
    );
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});