import { Transform, Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateEmployeeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  personId: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  employeeNumber: string;

  @IsDateString()
  hireDate: string;

}
