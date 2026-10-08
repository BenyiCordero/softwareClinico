import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PriceDetailStatus } from '../../enum/price-detail-status.enum';

export class UpdatePriceListDetailDto {
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) @IsString() @Matches(/^\d{1,12}(\.\d{1,2})?$/) price?: string;
  @IsOptional() @IsEnum(PriceDetailStatus) status?: PriceDetailStatus;
}
