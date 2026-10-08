import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Branch } from '../module-branch/entity/branch.entity';
import { Patient } from '../module-patient/entity/patient.entity';
import { Service } from '../module-service/entity/service.entity';
import { User } from '../module-user/entity/user.entity';
import { PatientSpecialPrice } from './entity/patient-special-price.entity';
import { PatientSpecialPriceController } from './patient-special-price.controller';
import { PatientSpecialPriceService } from './patient-special-price.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      PatientSpecialPrice,
      Patient,
      Service,
      Branch,
      User,
    ]),
  ],
  providers: [PatientSpecialPriceService],
  controllers: [PatientSpecialPriceController],
  exports: [],
})
export class PatientSpecialPriceModule {}
