import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SchedulingType } from '../../enum/scheduling-type.enum';
import { ServiceStatus } from '../../enum/service-status.enum';

export class FindServiceQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(SchedulingType) schedulingType?: SchedulingType;
  @IsOptional() @IsEnum(ServiceStatus) status?: ServiceStatus;
}
