import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entity/consultation.entity';
import { Diagnosis } from './entity/diagnosis.entity';
import { Treatment } from './entity/treatment.entity';
import { ClinicalNote } from './entity/clinical-note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consultation,
      Diagnosis,
      Treatment,
      ClinicalNote,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ConsultationModule {}
