import { apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery, CatalogPage } from '@/features/catalogs/catalog.types'
export interface DashboardActivity { auditLogId: number; action: string; resource: string; resourceId: number | null; userId: number; branchId: number | null; createdAt: string; metadata: Record<string, unknown> | null }
export const dashboardApi = {
  count: (resource: string, query: CatalogListQuery) => apiRequestPage<Record<string, unknown>>({ method: 'GET', url: `/${resource}`, params: query }),
  activity: (query: CatalogListQuery): Promise<CatalogPage<DashboardActivity>> => apiRequestPage<DashboardActivity>({ method: 'GET', url: '/audit-logs', params: query }),
}
