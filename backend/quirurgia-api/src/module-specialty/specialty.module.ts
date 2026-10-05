import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './entity/specialty.entity';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Specialty,
    ]),
  ],
  providers: [SpecialtyService],
  controllers: [SpecialtyController],
  exports: [],
})
export class SpecialtyModule {}
