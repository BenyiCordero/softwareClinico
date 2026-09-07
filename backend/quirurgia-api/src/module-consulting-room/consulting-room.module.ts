import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultingRoom } from './entity/consulting-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConsultingRoom,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ConsultingRoomModule {}
