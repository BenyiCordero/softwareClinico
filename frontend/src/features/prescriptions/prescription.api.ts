import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { Prescription, PrescriptionItem } from './prescription.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const prescriptionsApi = {
  list: (query: CatalogListQuery) => apiRequestPage<Prescription>({ method: 'GET', url: '/prescriptions', params: query }),
  create: (input: Record<string, unknown>) => apiRequest<Prescription>({ method: 'POST', url: '/prescriptions', data: numeric(compact(input), 'consultationId', 'healthProfessionalId') }),
  update: (id: number, input: Record<string, unknown>) => apiRequest<Prescription>({ method: 'PATCH', url: `/prescriptions/${id}`, data: compact(input) }),
  transition: (id: number, action: string) => apiRequest<Prescription>({ method: 'POST', url: `/prescriptions/${id}/${action}` }),
  items: (id: number) => apiRequest<PrescriptionItem[]>({ method: 'GET', url: `/prescriptions/${id}/items` }),
  createItem: (id: number, input: Record<string, unknown>) => apiRequest<PrescriptionItem>({ method: 'POST', url: `/prescriptions/${id}/items`, data: compact(input) }),
  updateItem: (id: number, itemId: number, input: Record<string, unknown>) => apiRequest<PrescriptionItem>({ method: 'PATCH', url: `/prescriptions/${id}/items/${itemId}`, data: compact(input) }),
  removeItem: (id: number, itemId: number) => apiRequest<void>({ method: 'DELETE', url: `/prescriptions/${id}/items/${itemId}` }),
}
