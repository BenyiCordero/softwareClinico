import { QueryFailedError } from 'typeorm';

interface PostgresDriverError {
  code?: string;
  constraint?: string;
  detail?: string;
}

export const POSTGRES_UNIQUE_VIOLATION = '23505';

export function isPostgresUniqueViolation(
  error: unknown,
): error is QueryFailedError & {
  driverError: PostgresDriverError;
} {
  return (
    error instanceof QueryFailedError &&
    typeof error.driverError === 'object' &&
    error.driverError !== null &&
    'code' in error.driverError &&
    error.driverError.code === POSTGRES_UNIQUE_VIOLATION
  );
}