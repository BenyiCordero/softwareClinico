import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from './entity/emergency-contact.entity';
import { Patient } from './entity/patient.entity';
import { PersonModule } from '../module-person/person.module';
import { PatientCategoryModule } from '../module-patient-category/patient-category.module';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { DatabaseModule } from '../common/module/database.module';

@Module({
  imports: [
    PersonModule,
    PatientCategoryModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      Patient,
      EmergencyContact,
    ]),
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
