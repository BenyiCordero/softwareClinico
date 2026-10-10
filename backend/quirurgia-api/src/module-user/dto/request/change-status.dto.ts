import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../enum/user-status.enum';

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status!: UserStatus;
}
