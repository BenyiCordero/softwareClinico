import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { HealthProfessionalStatus } from '../../enum/health-professional-status.enum';

export class UpdateHealthProfessionalDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 100)
  professionalLicense?: string;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 100)
  specialtyLicense?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 2000)
  bio?: string | null;

  @IsOptional()
  @IsEnum(HealthProfessionalStatus)
  status?: HealthProfessionalStatus;
}
