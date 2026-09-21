import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { CliModule } from '../cli.module';
import { CreateUserDto } from '../../module-user/dto/request/create-user.dto';
import { UserService } from '../../module-user/user.service';

/**
 * Bootstrap script for the initial administrator user.
 * Uses the same UserService (and password hashing path) as the API.
 * Idempotent: aborts if a user with the configured email already exists.
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);
  try {
    const configService = app.get(ConfigService);
    const logger = await app.resolve(PinoLogger);
    const usersService = app.get(UserService);

    const email = configService.get<string>('ADMIN_EMAIL');
    const password = configService.get<string>('ADMIN_PASSWORD');
    const personId = Number(configService.get<string>('ADMIN_PERSON_ID'));
    const roleId = Number(configService.get<string>('ADMIN_ROLE_ID'));
    const branchIdValue = configService.get<string>('ADMIN_BRANCH_ID');
    const branchId = branchIdValue ? Number(branchIdValue) : undefined;
    const username = configService.get<string>('ADMIN_USERNAME') ?? email?.split('@')[0];

    if (!email || !password || !username || !personId || !roleId) {
      throw new Error(
        'Missing admin environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PERSON_ID, ADMIN_ROLE_ID',
      );
    }

    const existing = await usersService.findByEmail(email);
    if (existing) {
      logger.warn({ userId: existing.userId }, 'Admin already exists by email, skipping');
      return;
    }

    const dto = new CreateUserDto();
    dto.username = username;
    dto.email = email;
    dto.password = password;
    dto.personId = personId;
    dto.roleId = roleId;
    if (branchId) dto.branchId = branchId;

    await usersService.create(dto);
    logger.info('Administrator created successfully');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});