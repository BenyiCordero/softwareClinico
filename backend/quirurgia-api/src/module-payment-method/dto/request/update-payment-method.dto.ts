import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PaymentMethodStatus } from '../../enum/payment-method-status.enum';

export class UpdatePaymentMethodDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 50)
  code?: string;

  @IsOptional()
  @IsEnum(PaymentMethodStatus)
  status?: PaymentMethodStatus;
}
