import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleHour } from './entity/schedule-hour.entity';
import { ScheduleBlock } from './entity/schedule-block.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { DatabaseModule } from '../common/module/database.module';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { User } from '../module-user/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Schedule,
      ScheduleHour,
      ScheduleBlock,
      Branch,
      ConsultingRoom,
      HealthProfessional,
      User,
    ]),
  ],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
