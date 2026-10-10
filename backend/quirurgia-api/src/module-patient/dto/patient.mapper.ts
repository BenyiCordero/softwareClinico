import { Patient } from '../entity/patient.entity';
import { EmergencyContactResponseDto } from './response/emergency-contact-response.dto';
import { PatientResponseDto } from './response/patient-response.dto';
import { PersonMapper } from '../../module-person/dto/person.mapper';

export class PatientMapper {
  static toContactResponse(
    contact: NonNullable<Patient['emergencyContacts']>[number],
  ): EmergencyContactResponseDto {
    return {
      emergencyContactId: contact.emergencyContactId,
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      secondaryPhone: contact.secondaryPhone,
      email: contact.email,
      priority: contact.priority,
      status: contact.status,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  static toResponseDto(patient: Patient): PatientResponseDto {
    return {
      patientId: patient.patientId,
      patientNumber: patient.patientNumber,
      bloodType: patient.bloodType,
      allergiesSummary: patient.allergiesSummary,
      status: patient.status,
      registeredAt: patient.registeredAt,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      person: PersonMapper.toResponseDto(patient.person),
      patientCategory: patient.patientCategory,
      emergencyContacts: (patient.emergencyContacts ?? []).map(
        PatientMapper.toContactResponse,
      ),
    };
  }
}
