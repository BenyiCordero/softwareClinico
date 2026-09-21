import { PaymentMethod } from '../entity/payment-method.entity';
import { PaymentMethodResponseDto } from './res/payment-method-response.dto';

export class PaymentMethodMapper {
  static toResponseDto(paymentMethod: PaymentMethod): PaymentMethodResponseDto {
    return {
      paymentMethodId: paymentMethod.paymentMethodId,
      name: paymentMethod.name,
      code: paymentMethod.code,
      status: paymentMethod.status,
      createdAt: paymentMethod.createdAt,
    };
  }
}