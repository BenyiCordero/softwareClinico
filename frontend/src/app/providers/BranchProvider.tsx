import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type PropsWithChildren } from 'react'
import { authApi } from '@/features/auth/auth.api'
import { branchApi } from '@/features/branches/branch.api'
import { useAuth } from './auth-context'
import { BranchContext, type BranchContextValue } from './branch-context'
import { useBranchStore } from '@/stores/branchStore'

export function BranchProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const activeBranchId = useBranchStore((state) => state.activeBranchId)
  const setActiveBranchId = useBranchStore((state) => state.setActiveBranchId)

  const branchesQuery = useQuery({
    queryKey: ['branches', 'available'],
    queryFn: () => branchApi.list({ page: 1, limit: 100 }),
    enabled: isAuthenticated,
  })

  const branches = branchesQuery.data?.data ?? []
  const activeBranch = branches.find((branch) => branch.branchId === activeBranchId) ?? null

  const permissionsQuery = useQuery({
    queryKey: ['users', user?.userId, 'permissions', activeBranchId],
    queryFn: () => authApi.getEffectivePermissions(user!.userId, activeBranchId),
    enabled: isAuthenticated && user !== null,
  })

  const permissions = permissionsQuery.data ?? []

  const value: BranchContextValue = {
    branches,
    activeBranch,
    activeBranchId,
    isLoading: branchesQuery.isLoading,
    permissions,
    permissionsLoading: permissionsQuery.isLoading,
    setActiveBranchId: (branchId) => {
      setActiveBranchId(branchId)
      void queryClient.invalidateQueries({ queryKey: ['branch-scoped'] })
    },
    can: (permission, mode = 'all') => {
      if (!permission) return true
      if (permissionsQuery.isLoading) return true

      const required = Array.isArray(permission) ? permission : [permission]
      return mode === 'any'
        ? required.some((item) => permissions.includes(item))
        : required.every((item) => permissions.includes(item))
    },
  }

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
}
