import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Sex } from '../../enum/sex.enum';

export class UpdatePersonDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  firstName?: string;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  middleName?: string | null;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  lastName?: string;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  secondLastName?: string | null;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @Length(18, 18)
  curp?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @Length(12, 13)
  rfc?: string | null;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(7, 30)
  phone?: string;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(7, 30)
  secondaryPhone?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @Length(5, 254)
  email?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 255)
  address?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  city?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @Length(2, 100)
  state?: string | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(3, 20)
  postalCode?: string | null;
}
