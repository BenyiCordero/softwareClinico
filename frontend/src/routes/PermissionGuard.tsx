import type { ReactNode } from 'react'
import { useBranch, useCan } from '@/app/providers/branch-context'
import AccessDenied from '@/components/AccessDenied'

interface PermissionGuardProps {
  permission?: string | string[]
  mode?: 'all' | 'any'
  fallback?: ReactNode
  children: ReactNode
}

export default function PermissionGuard({
  permission,
  mode = 'all',
  fallback = <AccessDenied />,
  children,
}: PermissionGuardProps) {
  const { permissionsLoading } = useBranch()
  const can = useCan(permission, mode)
  if (permissionsLoading) return <div className="page-content" role="status" aria-live="polite">Verificando permisos...</div>
  return can ? children : fallback
}
