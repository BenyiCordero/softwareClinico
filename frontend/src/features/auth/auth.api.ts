import { apiRequest } from '@/infrastructure/http'
import type { CurrentUser } from './auth.types'

export interface LoginInput {
  email: string
  password: string
}

export const authApi = {
  login(input: LoginInput): Promise<void> {
    return apiRequest<void>({
      method: 'POST',
      url: '/auth/login',
      data: input,
      skipAuthRefresh: true,
    })
  },

  refresh(): Promise<void> {
    return apiRequest<void>({
      method: 'POST',
      url: '/auth/refresh',
      skipAuthRefresh: true,
    })
  },

  logout(): Promise<void> {
    return apiRequest<void>({
      method: 'POST',
      url: '/auth/logout',
      skipAuthRefresh: true,
    })
  },

  getCurrentUser(): Promise<CurrentUser> {
    return apiRequest<CurrentUser>({
      method: 'GET',
      url: '/users/me',
    })
  },

  getEffectivePermissions(userId: number, branchId: number | null): Promise<string[]> {
    return apiRequest<string[]>({
      method: 'GET',
      url: `/users/${userId}/permissions`,
      params: branchId === null ? undefined : { branchId },
    })
  },
}
