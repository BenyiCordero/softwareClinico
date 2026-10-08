import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Area } from '../module-area/entity/area.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from './entity/consulting-room.entity';
import { ConsultingRoomController } from './consulting-room.controller';
import { ConsultingRoomService } from './consulting-room.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      ConsultingRoom,
      Branch,
      Area,
    ]),
  ],
  providers: [ConsultingRoomService],
  controllers: [ConsultingRoomController],
  exports: [],
})
export class ConsultingRoomModule {}
