import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { EmployeeStatus } from '../../enum/employee-status.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 50)
  employeeNumber?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  terminationDate?: string | null;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
