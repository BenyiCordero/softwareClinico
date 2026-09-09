import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entity/payment-method.entity';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';

/*Benyi es gei*/
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
    ]),
  ],
  providers: [
    PaymentMethodService
  ],
  controllers: [
    PaymentMethodController
  ],
  exports: [],
})
export class PaymentMethodModule {}
