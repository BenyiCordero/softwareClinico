import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateServiceAssignmentDto {
  @Type(() => Number) @IsInt() @Min(1) branchId: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) areaId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) consultingRoomId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) healthProfessionalId?: number;
}
