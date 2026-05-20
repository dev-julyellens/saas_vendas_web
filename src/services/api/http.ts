import { apiClient } from '@/services/api/client'
import type { ApiSuccessResponse, PaginationMeta } from '@/types/api'

export async function get<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await apiClient.get<ApiSuccessResponse<T>>(url, { params })
  return data
}

export async function post<T>(url: string, body?: unknown) {
  const { data } = await apiClient.post<ApiSuccessResponse<T>>(url, body)
  return data
}

export async function put<T>(url: string, body?: unknown) {
  const { data } = await apiClient.put<ApiSuccessResponse<T>>(url, body)
  return data
}

export async function del<T>(url: string) {
  const { data } = await apiClient.delete<ApiSuccessResponse<T>>(url)
  return data
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginationMeta
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<PaginatedResult<T>> {
  const response = await get<T[]>(url, params)
  return {
    items: response.data ?? [],
    meta: response.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
  }
}
