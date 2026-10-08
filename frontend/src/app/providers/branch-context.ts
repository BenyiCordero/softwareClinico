import { createContext, useContext } from 'react'
import type { Branch } from '@/features/branches/branch.types'

export interface BranchContextValue {
  branches: Branch[]
  activeBranch: Branch | null
  activeBranchId: number | null
  isLoading: boolean
  permissions: string[]
  permissionsLoading: boolean
  setActiveBranchId: (branchId: number | null) => void
  can: (permission?: string | string[], mode?: 'all' | 'any') => boolean
}

export const BranchContext = createContext<BranchContextValue | null>(null)

export function useBranch(): BranchContextValue {
  const context = useContext(BranchContext)
  if (!context) throw new Error('useBranch debe utilizarse dentro de BranchProvider')
  return context
}

export function useCan(permission?: string | string[], mode: 'all' | 'any' = 'all'): boolean {
  return useBranch().can(permission, mode)
}
