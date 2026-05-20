import { get } from '@/services/api/http'
import type { AnalyticsDashboard } from '@/types/analytics'

export const analyticsService = {
  dashboard(dateFrom: string, dateTo: string) {
    return get<AnalyticsDashboard>('/analytics/dashboard', {
      date_from: dateFrom,
      date_to: dateTo,
    })
  },
}
