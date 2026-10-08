import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecord } from './entity/clinical-record.entity';
import { MedicalHistory } from './entity/medical-history.entity';
import { ClinicalDocument } from './entity/clinical-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicalRecord,
      MedicalHistory,
      ClinicalDocument,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ClinicalRecordModule {}
