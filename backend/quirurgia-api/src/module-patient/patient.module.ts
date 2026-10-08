import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from './entity/emergency-contact.entity';
import { Patient } from './entity/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      EmergencyContact,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PatientModule {}
