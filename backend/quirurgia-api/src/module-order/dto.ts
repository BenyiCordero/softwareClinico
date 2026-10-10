import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { OrderStatus } from './enum/order-status.enum';
import { OrderDetailStatus } from './enum/order-detail-status.enum';
export class CreateOrderDto {
  @IsString() folio: string;
  @Type(() => Number) @IsInt() @Min(1) patientId: number;
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) appointmentId?: number;
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) consultationId?: number;
  @Type(() => Number) @IsInt() @Min(1) branchId: number;
  @IsEnum(OrderStatus) status: OrderStatus;
  @IsNumber() @Min(0) discount: number;
  @IsNumber() @Min(0) tax: number;
}
export class UpdateOrderDto {
  @IsOptional() @IsEnum(OrderStatus) status?: OrderStatus;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsNumber() @Min(0) tax?: number;
}
export class CreateOrderDetailDto {
  @Type(() => Number) @IsInt() @Min(1) serviceId: number;
  @IsString() description: string;
  @Type(() => Number) @IsInt() @Min(1) quantity: number;
  @IsNumber() @Min(0) unitPrice: number;
  @IsNumber() @Min(0) discount: number;
  @IsNumber() @Min(0) tax: number;
  @IsEnum(OrderDetailStatus) status: OrderDetailStatus;
}
export class UpdateOrderDetailDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) quantity?: number;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsNumber() @Min(0) tax?: number;
  @IsOptional() @IsEnum(OrderDetailStatus) status?: OrderDetailStatus;
}
