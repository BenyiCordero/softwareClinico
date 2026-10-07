import { ConsultingRoom } from '../entity/consulting-room.entity';
import { ConsultingRoomResponseDto } from './response/consulting-room-response.dto';

export class ConsultingRoomMapper {
  static toResponseDto(room: ConsultingRoom): ConsultingRoomResponseDto {
    return {
      consultingRoomId: room.consultingRoomId,
      branchId: room.branch.branchId,
      areaId: room.area?.areaId ?? null,
      code: room.code,
      name: room.name,
      floor: room.floor,
      description: room.description,
      status: room.status,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
