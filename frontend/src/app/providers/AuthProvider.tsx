import { useEffect, useMemo, type PropsWithChildren } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isApiError } from '@/infrastructure/http'
import { authApi } from '@/features/auth/auth.api'
import { getUserDisplayName } from '@/features/auth/auth.types'
import { useAuthStore } from '@/stores/authStore'
import { AuthContext, type AuthContextValue } from './auth-context'

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.messages[0]
  if (error instanceof Error) return error.message
  return 'No fue posible validar la sesión.'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const error = useAuthStore((state) => state.error)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setAnonymous = useAuthStore((state) => state.setAnonymous)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    let cancelled = false

    const initializeSession = async () => {
      setLoading()

      try {
        const currentUser = await authApi.getCurrentUser()
        if (!cancelled) setAuthenticated(currentUser)
      } catch (sessionError) {
        if (!cancelled) {
          const message = isApiError(sessionError) && sessionError.statusCode !== 401
            ? getErrorMessage(sessionError)
            : null
          setAnonymous(message)
        }
      }
    }

    void initializeSession()

    return () => {
      cancelled = true
    }
  }, [setAnonymous, setAuthenticated, setLoading])

  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession()
      if (location.pathname !== '/login') navigate('/login', { replace: true })
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [clearSession, location.pathname, navigate])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated' && user !== null,
    displayName: user ? getUserDisplayName(user) : null,
    login: async (input) => {
      setLoading()
      try {
        await authApi.login(input)
        const currentUser = await authApi.getCurrentUser()
        setAuthenticated(currentUser)
      } catch (loginError) {
        setAnonymous(getErrorMessage(loginError))
        throw loginError
      }
    },
    logout: async () => {
      try {
        await authApi.logout()
      } catch {
        // The local session must always be cleared even if the remote session is unavailable.
      } finally {
        clearSession()
      }
    },
  }), [clearSession, error, setAuthenticated, setAnonymous, setLoading, status, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
