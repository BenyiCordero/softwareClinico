import { PriceListStatus } from '../../enum/price-list-status.enum';

export class PriceListResponseDto {
  priceListId: number;
  name: string;
  description: string;
  branchId: number | null;
  patientCategoryId: number | null;
  currency: string;
  validFrom: string;
  validUntil: string | null;
  priority: number;
  status: PriceListStatus;
  createdAt: Date;
  updatedAt: Date;
}
