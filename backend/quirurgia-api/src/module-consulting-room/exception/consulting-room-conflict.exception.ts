import { ConflictException } from '@nestjs/common';
import { ConsultingRoomConflictReasonEnum } from '../enum/consulting-room-conflict-reason.enum';

export class ConsultingRoomConflictException extends ConflictException {
  constructor(reason: ConsultingRoomConflictReasonEnum) {
    super(`Consulting room ${reason} already exists`);
  }
}
