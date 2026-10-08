import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { AssignmentType } from '../../enum/assignment-type.enum';

export class CreateEmployeeAssignmentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  areaId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  positionId: number;

  @IsEnum(AssignmentType)
  assignmentType: AssignmentType;

  @IsDateString()
  startDate: string;
}
