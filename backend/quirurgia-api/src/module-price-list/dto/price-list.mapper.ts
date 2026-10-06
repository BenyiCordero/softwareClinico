import { PriceListDetail } from '../entity/price-list-detail.entity';
import { PriceList } from '../entity/price-list.entity';
import { PriceListDetailResponseDto } from './response/price-list-detail-response.dto';
import { PriceListResponseDto } from './response/price-list-response.dto';

export class PriceListMapper {
  static toResponseDto(list: PriceList): PriceListResponseDto {
    return { priceListId: list.priceListId, name: list.name, description: list.description, branchId: list.branch?.branchId ?? null, patientCategoryId: list.patientCategory?.patientCategoryId ?? null, currency: list.currency, validFrom: list.validFrom, validUntil: list.validUntil, priority: list.priority, status: list.status, createdAt: list.createdAt, updatedAt: list.updatedAt };
  }
  static toDetailResponseDto(detail: PriceListDetail): PriceListDetailResponseDto {
    return { priceListDetailId: detail.priceListDetailId, serviceId: detail.service.serviceId, price: detail.price, status: detail.status, createdAt: detail.createdAt, updatedAt: detail.updatedAt };
  }
}
