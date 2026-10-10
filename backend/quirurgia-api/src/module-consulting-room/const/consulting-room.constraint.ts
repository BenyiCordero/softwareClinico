import { ConsultingRoomConstraintEnum } from '../enum/consulting-room-constraint.enum';
import { ConsultingRoomConflictReasonEnum } from '../enum/consulting-room-conflict-reason.enum';
import { ConsultingRoomConflictException } from '../exception/consulting-room-conflict.exception';

export const CONSULTING_ROOM_CONSTRAINT_MAP: Record<
  ConsultingRoomConstraintEnum,
  () => ConsultingRoomConflictException
> = {
  [ConsultingRoomConstraintEnum.BRANCH_CODE]: () =>
    new ConsultingRoomConflictException(
      ConsultingRoomConflictReasonEnum.BRANCH_CODE,
    ),
};
