import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { OffsetPaginationQuery } from '@/types/api'
import type { Branch, BranchStatus } from './branch.types'

export interface BranchListQuery extends OffsetPaginationQuery {
  code?: string
  name?: string
  status?: BranchStatus
}

export interface CreateBranchInput {
  code: string
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  timezone: string
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {
  status?: BranchStatus
}

export const branchApi = {
  list(query: BranchListQuery = {}) {
    return apiRequestPage<Branch>({
      method: 'GET',
      url: '/branches',
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 100,
        code: query.code,
        name: query.name,
        status: query.status,
      },
    })
  },

  create(input: CreateBranchInput) {
    return apiRequest<Branch>({ method: 'POST', url: '/branches', data: input })
  },

  update(branchId: number, input: UpdateBranchInput) {
    return apiRequest<Branch>({ method: 'PATCH', url: `/branches/${branchId}`, data: input })
  },

  remove(branchId: number) {
    return apiRequest<void>({ method: 'DELETE', url: `/branches/${branchId}` })
  },
}
