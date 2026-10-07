import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Position } from './entity/position.entity';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Position,
    ]),
  ],
  providers: [PositionService],
  controllers: [PositionController],
  exports: [],
})
export class PositionModule {}
