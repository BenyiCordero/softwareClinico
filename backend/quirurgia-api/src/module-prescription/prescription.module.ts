import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entity/prescription.entity';
import { PrescriptionItem } from './entity/prescription-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionItem,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PrescriptionModule {}
