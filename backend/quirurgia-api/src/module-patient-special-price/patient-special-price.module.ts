import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientSpecialPrice } from './entity/patient-special-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientSpecialPrice,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PatientSpecialPriceModule {}
