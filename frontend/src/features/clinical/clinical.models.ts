export type ClinicalRecordStatus = 'OPEN' | 'RESTRICTED' | 'ARCHIVED' | 'CLOSED'
export type ConsultationStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'AMENDED'
export type ClinicalNoteStatus = 'DRAFT' | 'SIGNED' | 'AMENDED' | 'VOIDED'
export type ClinicalDocumentStatus = 'ACTIVE' | 'ARCHIVED' | 'VOIDED'
export type DiagnosisType = 'PRESUMPTIVE' | 'CONFIRMED' | 'DIFFERENTIAL'
export type DiagnosisPriority = 'PRIMARY' | 'SECONDARY'
export interface ClinicalRecord { clinicalRecordId: number; patientId: number; recordNumber: string; openedAt: string; status: ClinicalRecordStatus }
export interface Consultation { consultationId: number; clinicalRecordId: number; appointmentId: number | null; healthProfessionalId: number; branchId: number; consultingRoomId: number | null; serviceId: number | null; reason: string; clinicalSummary: string | null; status: ConsultationStatus; startedAt: string; finishedAt: string | null }
export interface Diagnosis { diagnosisId: number; code: string | null; description: string; diagnosisType: DiagnosisType; priority: DiagnosisPriority; notes: string | null }
export interface Treatment { treatmentId: number; name: string; description: string; instructions: string; startDate: string | null; endDate: string | null; status: string }
export interface ClinicalNote { clinicalNoteId: number; healthProfessionalId: number; noteType: string; content: string; status: ClinicalNoteStatus }
export interface ClinicalDocument { clinicalDocumentId: number; consultationId: number | null; documentType: string; fileName: string; mimeType: string; fileSize: string; description: string | null; status: ClinicalDocumentStatus }
