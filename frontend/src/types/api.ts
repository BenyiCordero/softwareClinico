export type ApiTimestamp = string

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  timestamp: ApiTimestamp
}

export interface OffsetPaginationMeta {
  type: 'OFFSET'
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CursorPaginationMeta {
  type: 'CURSOR'
  limit: number
  hasNextPage: boolean
  nextCursor: string | null
  currentCursor: string | null
}

export type PaginationMeta = OffsetPaginationMeta | CursorPaginationMeta

export interface ApiPaginatedResponse<T> {
  success: true
  data: T[]
  pagination: PaginationMeta
  timestamp: ApiTimestamp
}

export interface ApiErrorResponse {
  success: false
  statusCode: number
  message?: string | string[]
  timestamp: ApiTimestamp
  path: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiPaginatedResponse<T>

export type ApiResult<T> = ApiSuccessResponse<T>

export interface OffsetPaginationQuery {
  page?: number
  limit?: number
}

export interface CursorPaginationQuery {
  limit?: number
  cursor?: string
}

export type PaginationQuery = OffsetPaginationQuery | CursorPaginationQuery

/** PostgreSQL numeric columns may be serialized as strings by the API. */
export type ApiDecimal = number | string

/** Date and timestamp fields are normalized after the HTTP boundary. */
export type ApiDate = string
