import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PatientStatus } from '../../enum/patient-status.enum';

export class FindPatientQueryDto {
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
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  patientNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientCategoryId?: number;

  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;
}
