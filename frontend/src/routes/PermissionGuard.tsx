import type { ReactNode } from 'react'
import { useCan } from '@/app/providers/branch-context'

interface PermissionGuardProps {
  permission?: string | string[]
  mode?: 'all' | 'any'
  fallback?: ReactNode
  children: ReactNode
}

export default function PermissionGuard({
  permission,
  mode = 'all',
  fallback = null,
  children,
}: PermissionGuardProps) {
  const can = useCan(permission, mode)
  return can ? children : fallback
}
