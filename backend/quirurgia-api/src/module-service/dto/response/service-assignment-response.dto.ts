import { ServiceAssignmentStatus } from '../../enum/service-assignment-status.enum';

export class ServiceAssignmentResponseDto {
  serviceAssignmentId: number;
  serviceId: number;
  branchId: number;
  areaId: number | null;
  consultingRoomId: number | null;
  healthProfessionalId: number | null;
  status: ServiceAssignmentStatus;
  createdAt: Date;
}
