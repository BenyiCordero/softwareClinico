import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PriceListStatus } from '../../enum/price-list-status.enum';

export class FindPriceListQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) patientCategoryId?: number;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsEnum(PriceListStatus) status?: PriceListStatus;
  @IsOptional() @IsDateString() effectiveOn?: string;
}
