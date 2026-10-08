import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { HealthProfessionalStatus } from '../../enum/health-professional-status.enum';

export class FindHealthProfessionalQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId?: number;

  @IsOptional()
  @IsString()
  professionalLicense?: string;

  @IsOptional()
  @IsEnum(HealthProfessionalStatus)
  status?: HealthProfessionalStatus;
}
