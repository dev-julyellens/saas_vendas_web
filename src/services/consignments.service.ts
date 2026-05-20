import { get, getPaginated, post } from '@/services/api/http'
import type {
  Consignment,
  ConsignmentFilters,
  ConsignmentFormData,
  ConsignmentItemAction,
} from '@/types/consignment'

export const consignmentsService = {
  list(filters?: ConsignmentFilters) {
    return getPaginated<Consignment>('/consignments', filters as Record<string, unknown>)
  },

  getById(id: string) {
    return get<Consignment>(`/consignments/${id}`)
  },

  create(payload: ConsignmentFormData) {
    return post<Consignment>('/consignments', payload)
  },

  dispatch(id: string) {
    return post<Consignment>(`/consignments/${id}/dispatch`)
  },

  partialSale(id: string, payload: ConsignmentItemAction) {
    return post<Consignment>(`/consignments/${id}/partial-sale`, payload)
  },

  partialReturn(id: string, payload: ConsignmentItemAction) {
    return post<Consignment>(`/consignments/${id}/partial-return`, payload)
  },

  collect(id: string, notes?: string) {
    return post<Consignment>(`/consignments/${id}/collect`, { notes })
  },

  close(id: string, notes?: string) {
    return post<Consignment>(`/consignments/${id}/close`, { notes })
  },
}
