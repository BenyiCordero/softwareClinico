import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { PatientCategory } from './entity/patient-category.entity';
import { PatientCategoryController } from './patient-category.controller';
import { PatientCategoryService } from './patient-category.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule,
    TypeOrmModule.forFeature([
      PatientCategory,
    ]),
  ],
  providers: [PatientCategoryService],
  controllers: [PatientCategoryController],
  exports: [PatientCategoryService],
})
export class PatientCategoryModule {}
