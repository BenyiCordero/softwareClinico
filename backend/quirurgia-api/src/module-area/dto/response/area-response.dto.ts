import { AreaStatus } from '../../enum/area-status.enum';

export class AreaResponseDto {
  areaId: number;
  branchId: number;
  parentAreaId: number | null;
  name: string;
  description: string;
  status: AreaStatus;
  createdAt: Date;
  updatedAt: Date;
}
