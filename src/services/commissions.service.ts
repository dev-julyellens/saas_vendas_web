import { get, getPaginated, patch } from '@/services/api/http'
import type { Commission, CommissionFilters, CommissionStatus } from '@/types/commission'

export const commissionsService = {
  list(filters?: CommissionFilters) {
    return getPaginated<Commission>('/commissions', filters as Record<string, unknown>)
  },

  getById(id: string) {
    return get<Commission>(`/commissions/${id}`)
  },

  updateStatus(id: string, status: CommissionStatus) {
    return patch<Commission>(`/commissions/${id}/status`, { status })
  },
}
