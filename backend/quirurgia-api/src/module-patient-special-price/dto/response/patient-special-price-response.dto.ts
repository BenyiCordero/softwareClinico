import { SpecialPriceStatus } from '../../enum/special-price-status.enum';

export class PatientSpecialPriceResponseDto {
  patientSpecialPriceId: number;
  patientId: number;
  serviceId: number;
  branchId: number | null;
  price: string;
  validFrom: string;
  validUntil: string | null;
  reason: string | null;
  authorizedByUserId: number;
  status: SpecialPriceStatus;
  createdAt: Date;
  updatedAt: Date;
}
