import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { AppointmentReschedule } from './entity/appointment-reschedule.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { DatabaseModule } from '../common/module/database.module';
import { Patient } from '../module-patient/entity/patient.entity';
import { Schedule } from '../module-schedule/entity/schedule.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { Service } from '../module-service/entity/service.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { User } from '../module-user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentReschedule,
      Patient,
      Schedule,
      HealthProfessional,
      Service,
      Branch,
      ConsultingRoom,
      User,
    ]),
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
