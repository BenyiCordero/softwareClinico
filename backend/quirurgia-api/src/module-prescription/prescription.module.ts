import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entity/prescription.entity';
import { PrescriptionItem } from './entity/prescription-item.entity';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionService } from './prescription.service';
import { Consultation } from '../module-consultation/entity/consultation.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionItem,
      Consultation,
      HealthProfessional,
    ]),
  ],
  providers: [PrescriptionService],
  controllers: [PrescriptionController],
  exports: [],
})
export class PrescriptionModule {}
