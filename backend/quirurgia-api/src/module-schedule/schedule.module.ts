import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleHour } from './entity/schedule-hour.entity';
import { ScheduleBlock } from './entity/schedule-block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedule,
      ScheduleHour,
      ScheduleBlock,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ScheduleModule {}
