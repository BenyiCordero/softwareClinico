import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SpecialPriceStatus } from '../../enum/special-price-status.enum';

export class FindPatientSpecialPriceQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) patientId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) serviceId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @IsOptional() @IsEnum(SpecialPriceStatus) status?: SpecialPriceStatus;
  @IsOptional() @IsDateString() effectiveOn?: string;
}
