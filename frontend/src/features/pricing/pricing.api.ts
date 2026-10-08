import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { PatientSpecialPrice, PriceList, PriceListDetail } from './pricing.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const pricingApi = {
  lists: {
    list: (query: CatalogListQuery) => apiRequestPage<PriceList>({ method: 'GET', url: '/price-lists', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<PriceList>({ method: 'POST', url: '/price-lists', data: numeric(compact(input), 'branchId', 'patientCategoryId', 'priority') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<PriceList>({ method: 'PATCH', url: `/price-lists/${id}`, data: numeric(compact(input), 'branchId', 'patientCategoryId', 'priority') }),
    remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/price-lists/${id}` }),
    publish: (id: number) => apiRequest<PriceList>({ method: 'POST', url: `/price-lists/${id}/publish` }),
    unpublish: (id: number) => apiRequest<PriceList>({ method: 'POST', url: `/price-lists/${id}/unpublish` }),
    details: (id: number) => apiRequest<PriceListDetail[]>({ method: 'GET', url: `/price-lists/${id}/details` }),
    createDetail: (id: number, input: Record<string, unknown>) => apiRequest<PriceListDetail>({ method: 'POST', url: `/price-lists/${id}/details`, data: numeric(compact(input), 'serviceId') }),
    updateDetail: (id: number, detailId: number, input: Record<string, unknown>) => apiRequest<PriceListDetail>({ method: 'PATCH', url: `/price-lists/${id}/details/${detailId}`, data: compact(input) }),
    removeDetail: (id: number, detailId: number) => apiRequest<void>({ method: 'DELETE', url: `/price-lists/${id}/details/${detailId}` }),
  },
  specialPrices: {
    list: (query: CatalogListQuery) => apiRequestPage<PatientSpecialPrice>({ method: 'GET', url: '/patient-special-prices', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<PatientSpecialPrice>({ method: 'POST', url: '/patient-special-prices', data: numeric(compact(input), 'patientId', 'serviceId', 'branchId') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<PatientSpecialPrice>({ method: 'PATCH', url: `/patient-special-prices/${id}`, data: numeric(compact(input), 'branchId') }),
    remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/patient-special-prices/${id}` }),
    approve: (id: number) => apiRequest<PatientSpecialPrice>({ method: 'POST', url: `/patient-special-prices/${id}/approve` }),
  },
}
