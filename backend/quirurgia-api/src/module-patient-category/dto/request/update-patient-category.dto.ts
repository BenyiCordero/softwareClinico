import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PatientCategoryStatus } from '../../enum/patient-category-status.enum';

export class UpdatePatientCategoryDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 500)
  description?: string;

  @IsOptional()
  @IsEnum(PatientCategoryStatus)
  status?: PatientCategoryStatus;
}
