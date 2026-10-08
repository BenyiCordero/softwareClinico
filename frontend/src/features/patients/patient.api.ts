import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { EmergencyContact, Patient } from './patient.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const patientsApi = {
  list: (query: CatalogListQuery) => apiRequestPage<Patient>({ method: 'GET', url: '/patients', params: query }),
  create: (input: Record<string, unknown>) => apiRequest<Patient>({ method: 'POST', url: '/patients', data: numeric(compact(input), 'personId', 'patientCategoryId') }),
  update: (id: number, input: Record<string, unknown>) => apiRequest<Patient>({ method: 'PATCH', url: `/patients/${id}`, data: numeric(compact(input), 'patientCategoryId') }),
  remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/patients/${id}` }),
  contacts: (id: number) => apiRequest<EmergencyContact[]>({ method: 'GET', url: `/patients/${id}/emergency-contacts` }),
  createContact: (id: number, input: Record<string, unknown>) => apiRequest<EmergencyContact>({ method: 'POST', url: `/patients/${id}/emergency-contacts`, data: compact(input) }),
  updateContact: (id: number, contactId: number, input: Record<string, unknown>) => apiRequest<EmergencyContact>({ method: 'PATCH', url: `/patients/${id}/emergency-contacts/${contactId}`, data: compact(input) }),
  removeContact: (id: number, contactId: number) => apiRequest<void>({ method: 'DELETE', url: `/patients/${id}/emergency-contacts/${contactId}` }),
}
