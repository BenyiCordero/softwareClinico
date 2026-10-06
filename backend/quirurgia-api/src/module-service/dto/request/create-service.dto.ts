import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { SchedulingType } from '../../enum/scheduling-type.enum';

export class CreateServiceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  code: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 1000)
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @IsEnum(SchedulingType)
  schedulingType: SchedulingType;
}
