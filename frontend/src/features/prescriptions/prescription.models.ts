export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
export interface Prescription { prescriptionId: number; consultationId: number; healthProfessionalId: number; issuedAt: string; notes: string | null; status: PrescriptionStatus }
export interface PrescriptionItem { prescriptionItemId: number; medication: string; presentation: string | null; dose: string; route: string | null; frequency: string; duration: string; instructions: string | null }
