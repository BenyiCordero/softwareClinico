import { IsOptional, IsString, Length } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  middleName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  lastName?: string;
}