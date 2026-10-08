import type { ApiDate, PaginationMeta } from '@/types/api'

export interface CatalogPage<T> {
  data: T[]
  pagination: PaginationMeta
}

export type CatalogStatus = 'ACTIVE' | 'INACTIVE'

export interface NamedCatalogItem {
  name: string
  description?: string | null
  status: string
  createdAt?: ApiDate
  updatedAt?: ApiDate
}

export interface CatalogListQuery {
  page: number
  limit: number
  [key: string]: string | number | undefined
}
