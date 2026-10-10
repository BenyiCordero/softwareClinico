import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdatePatientSpecialPriceDto {
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId?: number | null;
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  price?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @ValidateIf((_, value) => value !== null) @IsDateString() validUntil?:
    string | null;
  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 1000)
  reason?: string | null;
}
