import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api'

export class ApiError extends Error {
  readonly statusCode: number | null
  readonly path: string | null
  readonly messages: string[]
  readonly cause: unknown

  constructor(options: {
    message: string
    statusCode?: number | null
    path?: string | null
    messages?: string[]
    cause?: unknown
  }) {
    super(options.message)
    this.name = 'ApiError'
    this.statusCode = options.statusCode ?? null
    this.path = options.path ?? null
    this.messages = options.messages ?? [options.message]
    this.cause = options.cause
  }
}

function getMessages(message: ApiErrorResponse['message']): string[] {
  if (Array.isArray(message)) return message
  return message ? [message] : ['Ocurrio un error inesperado.']
}

export function normalizeApiError(error: AxiosError<ApiErrorResponse>): ApiError {
  const response = error.response
  const body = response?.data
  const messages = getMessages(body?.message)

  return new ApiError({
    message: messages[0],
    statusCode: body?.statusCode ?? response?.status ?? null,
    path: body?.path ?? error.config?.url ?? null,
    messages,
    cause: error,
  })
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
