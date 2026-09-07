import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entity/position.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Position,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PositionModule {}
