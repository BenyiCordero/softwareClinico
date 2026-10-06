import { ConsultingRoomStatus } from '../../enum/consulting-room-status.enum';

export class ConsultingRoomResponseDto {
  consultingRoomId: number;
  branchId: number;
  areaId: number | null;
  code: string;
  name: string;
  floor: string | null;
  description: string;
  status: ConsultingRoomStatus;
  createdAt: Date;
  updatedAt: Date;
}
