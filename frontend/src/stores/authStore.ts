import { create } from 'zustand'
import type { CurrentUser } from '@/features/auth/auth.types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AuthState {
  user: CurrentUser | null
  status: AuthStatus
  error: string | null
  setLoading: () => void
  setAuthenticated: (user: CurrentUser) => void
  setAnonymous: (error?: string | null) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  error: null,
  setLoading: () => set({ status: 'loading', error: null }),
  setAuthenticated: (user) => set({ user, status: 'authenticated', error: null }),
  setAnonymous: (error = null) => set({ user: null, status: 'anonymous', error }),
  clearSession: () => set({ user: null, status: 'anonymous', error: null }),
}))
