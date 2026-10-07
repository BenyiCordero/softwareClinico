import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Employee } from '../module-employee/entity/employee.entity';
import { Specialty } from '../module-specialty/entity/specialty.entity';
import { HealthProfessional } from './entity/health-professional.entity';
import { ProfessionalSpecialty } from './entity/professional-specialty.entity';
import { HealthProfessionalController } from './health-professional.controller';
import { HealthProfessionalService } from './health-professional.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      HealthProfessional,
      ProfessionalSpecialty,
      Employee,
      Specialty,
    ]),
  ],
  providers: [HealthProfessionalService],
  controllers: [HealthProfessionalController],
  exports: [],
})
export class HealthProfessionalModule {}
