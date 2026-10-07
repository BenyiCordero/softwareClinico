import { SpecialtyStatus } from '../../enum/specialty-status.enum';

export class SpecialtyResponseDto {
  specialtyId: number;
  name: string;
  description: string;
  status: SpecialtyStatus;
}
