export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'BLOCKED'
export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'UNKNOWN'
export type ContactPriority = 'PRIMARY' | 'SECONDARY'
export interface Patient { patientId: number; personId: number; patientNumber: string; patientCategoryId: number; bloodType: BloodType | null; allergiesSummary: string | null; status: PatientStatus; registeredAt: string }
export interface EmergencyContact { emergencyContactId: number; name: string; relationship: string; phone: string; secondaryPhone: string | null; email: string | null; priority: ContactPriority; status: string }
