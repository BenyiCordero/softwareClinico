import { createContext, useContext } from 'react'
import { ApiError } from '@/infrastructure/http'
import type { LoginInput } from '@/features/auth/auth.api'
import type { CurrentUser } from '@/features/auth/auth.types'
import type { AuthStatus } from '@/stores/authStore'

export interface AuthContextValue {
  user: CurrentUser | null
  status: AuthStatus
  error: string | null
  isAuthenticated: boolean
  displayName: string | null
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  return context
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 401
}
