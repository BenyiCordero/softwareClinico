import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery, CatalogPage } from './catalog.types'

export function listCatalog<T>(url: string, query: CatalogListQuery): Promise<CatalogPage<T>> {
  return apiRequestPage<T>({ method: 'GET', url, params: query })
}

export function createCatalog<T>(url: string, input: Record<string, unknown>): Promise<T> {
  return apiRequest<T>({ method: 'POST', url, data: input })
}

export function updateCatalog<T>(url: string, id: number, input: Record<string, unknown>): Promise<T> {
  return apiRequest<T>({ method: 'PATCH', url: `${url}/${id}`, data: input })
}

export function archiveCatalog(url: string, id: number): Promise<void> {
  return apiRequest<void>({ method: 'DELETE', url: `${url}/${id}` })
}
