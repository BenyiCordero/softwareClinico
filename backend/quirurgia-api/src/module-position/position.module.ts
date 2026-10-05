import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entity/position.entity';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Position,
    ]),
  ],
  providers: [PositionService],
  controllers: [PositionController],
  exports: [],
})
export class PositionModule {}
