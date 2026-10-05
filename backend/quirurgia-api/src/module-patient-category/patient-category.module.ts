import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientCategory } from './entity/patient-category.entity';
import { PatientCategoryController } from './patient-category.controller';
import { PatientCategoryService } from './patient-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientCategory,
    ]),
  ],
  providers: [PatientCategoryService],
  controllers: [PatientCategoryController],
  exports: [],
})
export class PatientCategoryModule {}
