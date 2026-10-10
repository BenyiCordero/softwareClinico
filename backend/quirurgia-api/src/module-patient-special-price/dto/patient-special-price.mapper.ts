import { PatientSpecialPrice } from '../entity/patient-special-price.entity';
import { PatientSpecialPriceResponseDto } from './response/patient-special-price-response.dto';

export class PatientSpecialPriceMapper {
  static toResponseDto(
    specialPrice: PatientSpecialPrice,
  ): PatientSpecialPriceResponseDto {
    return {
      patientSpecialPriceId: specialPrice.patientSpecialPriceId,
      patientId: specialPrice.patient.patientId,
      serviceId: specialPrice.service.serviceId,
      branchId: specialPrice.branch?.branchId ?? null,
      price: specialPrice.price,
      validFrom: specialPrice.validFrom,
      validUntil: specialPrice.validUntil,
      reason: specialPrice.reason,
      authorizedByUserId: specialPrice.authorizedByUser.userId,
      status: specialPrice.status,
      createdAt: specialPrice.createdAt,
      updatedAt: specialPrice.updatedAt,
    };
  }
}
