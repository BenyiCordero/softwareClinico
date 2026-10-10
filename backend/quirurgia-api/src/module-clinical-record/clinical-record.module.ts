import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecord } from './entity/clinical-record.entity';
import { MedicalHistory } from './entity/medical-history.entity';
import { ClinicalDocument } from './entity/clinical-document.entity';
import { ClinicalRecordController } from './clinical-record.controller';
import { ClinicalRecordService } from './clinical-record.service';
import { Patient } from '../module-patient/entity/patient.entity';
import { User } from '../module-user/entity/user.entity';
import { Consultation } from '../module-consultation/entity/consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicalRecord,
      MedicalHistory,
      ClinicalDocument,
      Patient,
      User,
      Consultation,
    ]),
  ],
  providers: [ClinicalRecordService],
  controllers: [ClinicalRecordController],
  exports: [],
})
export class ClinicalRecordModule {}
