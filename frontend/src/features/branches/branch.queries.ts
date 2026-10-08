import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { branchApi, type BranchListQuery, type CreateBranchInput, type UpdateBranchInput } from './branch.api'

export const branchKeys = {
  all: ['branches'] as const,
  list: (query: BranchListQuery) => ['branches', 'list', query] as const,
}

export function useBranchesQuery(query: BranchListQuery) {
  return useQuery({
    queryKey: branchKeys.list(query),
    queryFn: () => branchApi.list(query),
  })
}

export function useCreateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBranchInput) => branchApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: branchKeys.all }),
  })
}

export function useUpdateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ branchId, input }: { branchId: number; input: UpdateBranchInput }) => branchApi.update(branchId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: branchKeys.all }),
  })
}

export function useRemoveBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (branchId: number) => branchApi.remove(branchId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: branchKeys.all }),
  })
}
