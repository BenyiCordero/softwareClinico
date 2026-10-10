import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { ServiceAssignmentStatus } from '../../enum/service-assignment-status.enum';

export class UpdateServiceAssignmentDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  areaId?: number | null;
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  consultingRoomId?: number | null;
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  healthProfessionalId?: number | null;
  @IsOptional()
  @IsEnum(ServiceAssignmentStatus)
  status?: ServiceAssignmentStatus;
}
