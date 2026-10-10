import { NotFoundException } from '@nestjs/common';

export class PaymentMethodNotFoundException extends NotFoundException {
  constructor(paymentMethodId: number) {
    super(`Payment method with id ${paymentMethodId} not found`);
  }
}
