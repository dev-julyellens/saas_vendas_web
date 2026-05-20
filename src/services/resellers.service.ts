import { get, getPaginated, post, put, del } from '@/services/api/http'
import type { Reseller, ResellerFilters, ResellerFormData } from '@/types/reseller'

export const resellersService = {
  list(filters?: ResellerFilters) {
    return getPaginated<Reseller>('/resellers', filters as Record<string, unknown>)
  },

  getById(id: string) {
    return get<Reseller>(`/resellers/${id}`)
  },

  create(payload: ResellerFormData) {
    return post<Reseller>('/resellers', payload)
  },

  update(id: string, payload: Partial<ResellerFormData>) {
    return put<Reseller>(`/resellers/${id}`, payload)
  },

  remove(id: string) {
    return del(`/resellers/${id}`)
  },
}
