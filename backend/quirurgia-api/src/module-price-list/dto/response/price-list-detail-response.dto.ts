import { PriceDetailStatus } from '../../enum/price-detail-status.enum';

export class PriceListDetailResponseDto {
  priceListDetailId: number;
  serviceId: number;
  price: string;
  status: PriceDetailStatus;
  createdAt: Date;
  updatedAt: Date;
}
