import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @IsStrongPassword()
  password!: string;

  @IsInt()
  @Min(1)
  personId!: number;

  @IsInt()
  @Min(1)
  roleId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  branchId?: number;
}
