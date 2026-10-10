import { ConflictException, Injectable } from '@nestjs/common';
import { isPostgresUniqueViolation } from './postgres-error';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class DatabaseExceptionMapper {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(DatabaseExceptionMapper.name);
  }

  fromTypeOrmError(
    error: unknown,
    constraintMap: Record<string, () => Error>,
  ): never {
    if (!isPostgresUniqueViolation(error)) throw error;

    const constraint = error.driverError.constraint;
    const factory = constraint ? constraintMap[constraint] : undefined;

    if (factory) throw factory();
    this.logger.warn(
      { constraint, databaseCode: error.driverError.code },
      'Unmapped unique constraint violation',
    );
    throw new ConflictException('Duplicate entry');
  }
}
