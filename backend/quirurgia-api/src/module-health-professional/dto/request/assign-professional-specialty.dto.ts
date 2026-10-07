import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { SpecialtyPriority } from '../../enum/specialty-priority.enum';

export class AssignProfessionalSpecialtyDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  specialtyId: number;

  @IsEnum(SpecialtyPriority)
  priority: SpecialtyPriority;
}
