import { ContactPriority } from '../../enum/contact-priority.enum';
import { EmergencyContactStatus } from '../../enum/emergency-contact-status.enum';

export class EmergencyContactResponseDto {
  emergencyContactId: number;
  name: string;
  relationship: string;
  phone: string;
  secondaryPhone: string | null;
  email: string | null;
  priority: ContactPriority;
  status: EmergencyContactStatus;
  createdAt: Date;
  updatedAt: Date;
}
