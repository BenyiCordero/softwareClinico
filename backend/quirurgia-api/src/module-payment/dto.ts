import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentStatus } from './enum/payment-status.enum';
export class CreatePaymentDto {
  @Type(() => Number) @IsInt() @Min(1) orderId: number;
  @Type(() => Number) @IsInt() @Min(1) paymentMethodId: number;
  @IsNumber() @Min(0.01) amount: number;
  @IsOptional() @IsString() reference?: string;
  @IsEnum(PaymentStatus) status: PaymentStatus;
  @IsDateString() paidAt: string;
  @IsOptional() @IsString() notes?: string;
}
export class UpdatePaymentDto {
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() notes?: string;
}
