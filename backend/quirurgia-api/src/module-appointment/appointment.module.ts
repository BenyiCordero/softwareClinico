import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { AppointmentReschedule } from './entity/appointment-reschedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentReschedule,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AppointmentModule {}
