import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entity/payment-method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PaymentMethodModule {}
