import { getPaginated } from '@/services/api/http'
import type { Representative } from '@/types/representative'

export const representativesService = {
  list(search?: string) {
    return getPaginated<Representative>('/representatives', {
      per_page: 100,
      active_only: true,
      search: search || undefined,
    })
  },
}
