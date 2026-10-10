import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsISO4217CurrencyCode,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdatePriceListDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  name?: string;
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 1000)
  description?: string;
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId?: number | null;
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientCategoryId?: number | null;
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsISO4217CurrencyCode()
  currency?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @ValidateIf((_, value) => value !== null) @IsDateString() validUntil?:
    string | null;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority?: number;
}
