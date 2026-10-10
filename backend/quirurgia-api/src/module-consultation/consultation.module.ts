import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entity/consultation.entity';
import { Diagnosis } from './entity/diagnosis.entity';
import { Treatment } from './entity/treatment.entity';
import { ClinicalNote } from './entity/clinical-note.entity';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { ClinicalRecord } from '../module-clinical-record/entity/clinical-record.entity';
import { Appointment } from '../module-appointment/entity/appointment.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { Service } from '../module-service/entity/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consultation,
      Diagnosis,
      Treatment,
      ClinicalNote,
      ClinicalRecord,
      Appointment,
      HealthProfessional,
      Branch,
      ConsultingRoom,
      Service,
    ]),
  ],
  providers: [ConsultationService],
  controllers: [ConsultationController],
  exports: [],
})
export class ConsultationModule {}
