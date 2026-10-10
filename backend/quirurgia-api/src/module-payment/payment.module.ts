import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Order } from '../module-order/entity/order.entity';
import { PaymentMethod } from '../module-payment-method/entity/payment-method.entity';
import { User } from '../module-user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, PaymentMethod, User])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
