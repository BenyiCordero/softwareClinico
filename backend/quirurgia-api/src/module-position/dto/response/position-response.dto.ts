import { PositionStatus } from '../../enum/position-status.enum';

export class PositionResponseDto {
  positionId: number;
  name: string;
  description: string;
  status: PositionStatus;
  createdAt: Date;
  updatedAt: Date;
}
