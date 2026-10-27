import type { ReactNode } from 'react'
import PermissionGuard from '@/routes/PermissionGuard'
interface CanProps { permission?: string | string[]; mode?: 'all' | 'any'; fallback?: ReactNode; children: ReactNode }
export function Can({ permission, mode = 'all', fallback = null, children }: CanProps) { return <PermissionGuard permission={permission} mode={mode} fallback={fallback}>{children}</PermissionGuard> }
