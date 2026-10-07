import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { RequirementLevel } from '../../enum/requirement-level.enum';
import { ServiceRequirementStatus } from '../../enum/service-requirement-status.enum';

export class UpdateServiceRequirementDto {
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)) @IsString() @Length(2, 100) name?: string;
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) @IsString() @Length(2, 1000) description?: string;
  @IsOptional() @IsEnum(RequirementLevel) requirementLevel?: RequirementLevel;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) sortOrder?: number;
  @IsOptional() @IsEnum(ServiceRequirementStatus) status?: ServiceRequirementStatus;
}
