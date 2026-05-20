import { get, getPaginated, post, put, del } from '@/services/api/http'
import type { Sale, SaleFilters, SalesDashboard } from '@/types/sale'

export const salesService = {
  list(filters?: SaleFilters) {
    return getPaginated<Sale>('/sales', filters as Record<string, unknown>)
  },

  getById(id: string) {
    return get<Sale>(`/sales/${id}`)
  },

  dashboard(dateFrom?: string, dateTo?: string) {
    return get<SalesDashboard>('/sales/dashboard', { date_from: dateFrom, date_to: dateTo })
  },

  create(payload: unknown) {
    return post<Sale>('/sales', payload)
  },

  update(id: string, payload: unknown) {
    return put<Sale>(`/sales/${id}`, payload)
  },

  remove(id: string) {
    return del(`/sales/${id}`)
  },

  confirm(id: string) {
    return post<Sale>(`/sales/${id}/confirm`)
  },

  cancel(id: string) {
    return post<Sale>(`/sales/${id}/cancel`)
  },
}
