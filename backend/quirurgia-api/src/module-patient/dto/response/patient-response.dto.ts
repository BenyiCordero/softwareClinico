import { PatientCategoryResponseDto } from '../../../module-patient-category/dto/response/patient-category-response.dto';
import { PersonResponseDto } from '../../../module-person/dto/response/person-response.dto';
import { BloodType } from '../../enum/blood-type.enum';
import { PatientStatus } from '../../enum/patient-status.enum';
import { EmergencyContactResponseDto } from './emergency-contact-response.dto';

export class PatientResponseDto {
  patientId: number;
  patientNumber: string;
  bloodType: BloodType | null;
  allergiesSummary: string | null;
  status: PatientStatus;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  person: PersonResponseDto;
  patientCategory: PatientCategoryResponseDto;
  emergencyContacts: EmergencyContactResponseDto[];
}
