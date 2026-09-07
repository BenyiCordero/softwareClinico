import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entity/area.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Area,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AreaModule {}
