import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateAreaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentAreaId?: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 500)
  @IsNotEmpty()
  description: string;
}
