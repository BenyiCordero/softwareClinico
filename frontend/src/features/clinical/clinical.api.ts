import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { ClinicalDocument, ClinicalNote, ClinicalRecord, Consultation, Diagnosis, Treatment } from './clinical.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const clinicalApi = {
  records: {
    list: (query: CatalogListQuery) => apiRequestPage<ClinicalRecord>({ method: 'GET', url: '/clinical-records', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<ClinicalRecord>({ method: 'POST', url: '/clinical-records', data: numeric(compact(input), 'patientId') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<ClinicalRecord>({ method: 'PATCH', url: `/clinical-records/${id}`, data: compact(input) }),
    remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/clinical-records/${id}` }),
    history: (id: number) => apiRequest<ClinicalRecord>({ method: 'GET', url: `/clinical-records/${id}` }),
  },
  consultations: {
    list: (query: CatalogListQuery) => apiRequestPage<Consultation>({ method: 'GET', url: '/consultations', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<Consultation>({ method: 'POST', url: '/consultations', data: numeric(compact(input), 'clinicalRecordId', 'appointmentId', 'healthProfessionalId', 'branchId', 'consultingRoomId', 'serviceId') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<Consultation>({ method: 'PATCH', url: `/consultations/${id}`, data: numeric(compact(input), 'clinicalRecordId', 'appointmentId', 'healthProfessionalId', 'branchId', 'consultingRoomId', 'serviceId') }),
    transition: (id: number, action: string) => apiRequest<Consultation>({ method: 'POST', url: `/consultations/${id}/${action}` }),
    diagnoses: (id: number) => apiRequest<Diagnosis[]>({ method: 'GET', url: `/consultations/${id}/diagnoses` }),
    createDiagnosis: (id: number, input: Record<string, unknown>) => apiRequest<Diagnosis>({ method: 'POST', url: `/consultations/${id}/diagnoses`, data: compact(input) }),
    treatments: (id: number) => apiRequest<Treatment[]>({ method: 'GET', url: `/consultations/${id}/treatments` }),
    createTreatment: (id: number, input: Record<string, unknown>) => apiRequest<Treatment>({ method: 'POST', url: `/consultations/${id}/treatments`, data: compact(input) }),
    notes: (id: number) => apiRequest<ClinicalNote[]>({ method: 'GET', url: `/consultations/${id}/notes` }),
    createNote: (id: number, input: Record<string, unknown>) => apiRequest<ClinicalNote>({ method: 'POST', url: `/consultations/${id}/notes`, data: compact(input) }),
    documents: (id: number) => apiRequest<ClinicalDocument[]>({ method: 'GET', url: `/consultations/${id}/documents` }),
  },
}
