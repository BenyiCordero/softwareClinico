import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { CliModule } from '../cli.module';
import { PermissionService } from '../../module-permission/permission.service';
import { PermissionResource } from '../../module-permission/enum/permission-resource.enum';
import { PermissionAction } from '../../module-permission/enum/permission-action.enum';
import { CreatePermissionDto } from '../../module-permission/dto/request/create-permission.dto';
import { RolePermissionService } from '../../module-role/role-permission.service';

/**
 * Bootstrap script for the initial administrator user.
 * Uses the same UserService (and password hashing path) as the API.
 * Idempotent: aborts if a user with the configured email already exists.
 */
const initialPermissions: CreatePermissionDto[] = [
  {
    resource: PermissionResource.USERS,
    action: PermissionAction.MANAGE,
    description: 'Allows creating users',
  },
  {
    resource: PermissionResource.USERS,
    action: PermissionAction.READ,
    description: 'Allows reading users',
  },
  {
    resource: PermissionResource.PAYMENT_METHODS,
    action: PermissionAction.MANAGE,
    description: 'Allows updating users',
  },
    {
    resource: PermissionResource.PAYMENT_METHODS,
    action: PermissionAction.READ,
    description: 'Allows reading users',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);
  try {
    const configService = app.get(ConfigService);
    const logger = await app.resolve(PinoLogger);
    const permissionService = app.get(PermissionService);
    const rolePermissionService = app.get(RolePermissionService);
    const roleId = Number(configService.getOrThrow<string>('ADMIN_ROLE_ID'));
    const permissions = await permissionService.createManyIfNotExists(
      initialPermissions,
    );
    await rolePermissionService.createManyIfNotExists(
      roleId,
      permissions.map(({ permissionId }) => permissionId)
    );
    logger.info('permisions created');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});