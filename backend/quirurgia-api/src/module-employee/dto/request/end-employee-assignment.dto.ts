import { IsDateString, IsOptional } from 'class-validator';

export class EndEmployeeAssignmentDto {
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
