import type { ApiDate } from '@/types/api'

export interface Person {
  personId: number
  firstName: string
  middleName: string | null
  lastName: string
  secondLastName: string | null
  birthDate: ApiDate
  sex: 'MALE' | 'FEMALE' | 'UNSPECIFIED'
  curp: string | null
  rfc: string | null
  phone: string
  secondaryPhone: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  createdAt: ApiDate
  updatedAt: ApiDate
}

export interface Area { areaId: number; branchId: number; parentAreaId: number | null; name: string; description: string; status: string; createdAt: ApiDate; updatedAt: ApiDate }
export interface ConsultingRoom { consultingRoomId: number; branchId: number; areaId: number | null; code: string; name: string; floor: string | null; description: string; status: string; createdAt: ApiDate; updatedAt: ApiDate }
export interface Position { positionId: number; name: string; description: string; status: string; createdAt: ApiDate; updatedAt: ApiDate }
export interface Specialty { specialtyId: number; name: string; description: string; status: string }
export interface PatientCategory { patientCategoryId: number; name: string; description: string; status: string; createdAt: ApiDate; updatedAt: ApiDate }
export interface PaymentMethod { paymentMethodId: number; name: string; code: string; status: string; createdAt: ApiDate }
