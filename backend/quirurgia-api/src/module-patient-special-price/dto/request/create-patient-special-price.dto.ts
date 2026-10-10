import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreatePatientSpecialPriceDto {
  @Type(() => Number) @IsInt() @Min(1) patientId: number;
  @Type(() => Number) @IsInt() @Min(1) serviceId: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  price: string;
  @IsDateString() validFrom: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 1000)
  reason?: string | null;
}
