import { SchedulingType } from '../../enum/scheduling-type.enum';
import { ServiceStatus } from '../../enum/service-status.enum';

export class ServiceResponseDto {
  serviceId: number; categoryId: number; code: string; name: string; description: string;
  durationMinutes: number; schedulingType: SchedulingType; status: ServiceStatus; createdAt: Date; updatedAt: Date;
}
