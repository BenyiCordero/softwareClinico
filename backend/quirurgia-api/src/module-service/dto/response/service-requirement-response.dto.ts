import { RequirementLevel } from '../../enum/requirement-level.enum';
import { ServiceRequirementStatus } from '../../enum/service-requirement-status.enum';

export class ServiceRequirementResponseDto {
  serviceRequirementId: number;
  serviceId: number;
  name: string;
  description: string;
  requirementLevel: RequirementLevel;
  sortOrder: number;
  status: ServiceRequirementStatus;
}
