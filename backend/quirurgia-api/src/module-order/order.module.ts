import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderDetail } from './entity/order-detail.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Patient } from '../module-patient/entity/patient.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { Appointment } from '../module-appointment/entity/appointment.entity';
import { Consultation } from '../module-consultation/entity/consultation.entity';
import { Service } from '../module-service/entity/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      Patient,
      Branch,
      Appointment,
      Consultation,
      Service,
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
