import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class CreatePriceListDetailDto {
  @Type(() => Number) @IsInt() @Min(1) serviceId: number;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) @IsString() @IsNotEmpty() @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  price: string;
}
