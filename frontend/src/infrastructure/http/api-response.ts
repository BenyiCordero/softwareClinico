import type { AxiosResponse } from 'axios'
import type {
  ApiPaginatedResponse,
  ApiResponse,
  ApiSuccessResponse,
  PaginationMeta,
} from '@/types/api'
import { ApiError } from './api-error'

function assertSuccess<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
  if (response.status === 204) return { success: true, data: undefined as T, timestamp: new Date().toISOString() }

  const body = response.data
  if (!body || body.success !== true) {
    throw new ApiError({ message: 'La API devolvio una respuesta invalida.' })
  }

  return body
}

export function getApiData<T>(response: AxiosResponse<ApiSuccessResponse<T>>): T {
  return assertSuccess(response).data as T
}

export function getApiPage<T>(
  response: AxiosResponse<ApiPaginatedResponse<T>>,
): { data: T[]; pagination: PaginationMeta } {
  const body = assertSuccess(response) as ApiPaginatedResponse<T>
  return { data: body.data, pagination: body.pagination }
}
