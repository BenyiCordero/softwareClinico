import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderDetail } from './entity/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class OrderModule {}
