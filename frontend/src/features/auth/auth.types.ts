import type { ApiDate } from '@/types/api'

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DISABLED'
export type UserRoleStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED'

export interface UserRoleAssignment {
  userRoleId: number
  roleId: number
  roleName: string
  branchId: number | null
  status: UserRoleStatus
  validFrom: ApiDate | null
  validUntil: ApiDate | null
}

export interface CurrentUser {
  userId: number
  username: string
  email: string
  status: UserStatus
  personId: number | null
  firstName: string | null
  middleName: string | null
  lastName: string | null
  secondLastName: string | null
  createdAt: ApiDate
  updatedAt: ApiDate
  roles: UserRoleAssignment[]
}

export function getUserDisplayName(user: CurrentUser): string {
  const name = [user.firstName, user.middleName, user.lastName, user.secondLastName]
    .filter(Boolean)
    .join(' ')
    .trim()

  return name || user.username || user.email
}
