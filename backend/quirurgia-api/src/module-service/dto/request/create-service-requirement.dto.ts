import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { RequirementLevel } from '../../enum/requirement-level.enum';

export class CreateServiceRequirementDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString() @Length(2, 100) @IsNotEmpty()
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString() @Length(2, 1000) @IsNotEmpty()
  description: string;

  @IsEnum(RequirementLevel)
  requirementLevel: RequirementLevel;

  @Type(() => Number) @IsInt() @Min(0)
  sortOrder: number;
}
