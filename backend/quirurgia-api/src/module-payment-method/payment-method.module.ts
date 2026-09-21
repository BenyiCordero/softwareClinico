import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entity/payment-method.entity';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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