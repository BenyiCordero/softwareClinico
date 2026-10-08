import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { appEnv } from '@/config/env'
import { useBranchStore } from '@/stores/branchStore'
import type { ApiErrorResponse, ApiPaginatedResponse, ApiResponse, ApiSuccessResponse } from '@/types/api'
import { ApiError, normalizeApiError } from './api-error'
import { getApiData, getApiPage } from './api-response'

interface RetryableRequestConfig extends AxiosRequestConfig {
  _authRetry?: boolean
  skipAuthRefresh?: boolean
}

const apiClient = axios.create({
  baseURL: appEnv.apiUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const branchId = useBranchStore.getState().activeBranchId
  if (branchId !== null) {
    config.headers.set('x-branch-id', String(branchId))
  } else {
    config.headers.delete('x-branch-id')
  }
  return config
})

let refreshPromise: Promise<void> | null = null

function isAuthEndpoint(url?: string): boolean {
  return !!url && /^\/?auth\/(login|refresh|logout)/.test(url)
}

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh', undefined, { skipAuthRefresh: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      config &&
      !config._authRetry &&
      !config.skipAuthRefresh &&
      !isAuthEndpoint(config.url)
    ) {
      config._authRetry = true

      try {
        await refreshSession()
        return apiClient.request(config)
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:session-expired'))
        }
        if (refreshError instanceof ApiError) throw refreshError
        throw normalizeApiError(refreshError as AxiosError<ApiErrorResponse>)
      }
    }

    if (error.response?.data?.success === false || error.response) {
      throw normalizeApiError(error)
    }

    throw new ApiError({
      message: error.message || 'No fue posible conectar con la API.',
      cause: error,
    })
  },
)

export async function apiRequest<T>(config: RetryableRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>(config)
  return getApiData(response as AxiosResponse<ApiSuccessResponse<T>>)
}

export async function apiRequestPage<T>(
  config: RetryableRequestConfig,
): Promise<ReturnType<typeof getApiPage<T>>> {
  const response = await apiClient.request<ApiPaginatedResponse<T>>(config)
  return getApiPage(response)
}

export { apiClient }
