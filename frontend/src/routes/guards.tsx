import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'

function SessionLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-ink-muted">
      Validando sesión...
    </div>
  )
}

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { status, isAuthenticated } = useAuth()
  if (status === 'loading') return <SessionLoading />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { status, isAuthenticated } = useAuth()
  if (status === 'loading') return <SessionLoading />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}
