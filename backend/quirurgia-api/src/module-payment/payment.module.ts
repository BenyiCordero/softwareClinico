import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PaymentModule {}
