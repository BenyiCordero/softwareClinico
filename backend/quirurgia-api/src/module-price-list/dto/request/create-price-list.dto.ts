import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePriceListDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  name: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 1000)
  @IsNotEmpty()
  description: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) patientCategoryId?: number;
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsISO4217CurrencyCode()
  currency: string;
  @IsDateString() validFrom: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @Type(() => Number) @IsInt() @Min(0) priority: number;
}
