export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedParams {
  page?: number
  per_page?: number
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function isApiError(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return !response.success
}
