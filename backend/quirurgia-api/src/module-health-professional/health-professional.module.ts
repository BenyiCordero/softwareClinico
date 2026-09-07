import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthProfessional } from './entity/health-professional.entity';
import { ProfessionalSpecialty } from './entity/professional-specialty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthProfessional,
      ProfessionalSpecialty,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class HealthProfessionalModule {}
