import { IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  @IsStrongPassword()
  newPassword!: string;
}