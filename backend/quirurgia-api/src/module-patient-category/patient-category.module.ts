import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientCategory } from './entity/patient-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientCategory,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PatientCategoryModule {}
