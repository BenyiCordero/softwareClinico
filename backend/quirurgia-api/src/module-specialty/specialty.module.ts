import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './entity/specialty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Specialty,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class SpecialtyModule {}
