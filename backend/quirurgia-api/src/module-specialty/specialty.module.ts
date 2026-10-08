import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Specialty } from './entity/specialty.entity';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Specialty,
    ]),
  ],
  providers: [SpecialtyService],
  controllers: [SpecialtyController],
  exports: [],
})
export class SpecialtyModule {}
