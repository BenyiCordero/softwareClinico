import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BranchState {
  activeBranchId: number | null
  setActiveBranchId: (branchId: number | null) => void
  clearActiveBranch: () => void
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      activeBranchId: null,
      setActiveBranchId: (activeBranchId) => set({ activeBranchId }),
      clearActiveBranch: () => set({ activeBranchId: null }),
    }),
    { name: 'quirurgia-branch-preference' },
  ),
)
