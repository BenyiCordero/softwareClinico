import type { ApiDate } from '@/types/api'

export type BranchStatus = 'ACTIVE' | 'TEMPORARILY_CLOSED' | 'INACTIVE'

export interface Branch {
  branchId: number
  code: string
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  timezone: string
  status: BranchStatus
  createdAt: ApiDate
  updatedAt: ApiDate
}
