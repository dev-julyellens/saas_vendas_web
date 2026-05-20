import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import type { AnalyticsPeriod } from '@/types/analytics'

export const ANALYTICS_QUERY_KEY = 'analytics-dashboard' as const

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 30 * 60 * 1000

export function useAnalyticsDashboard(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEY, period.from, period.to],
    queryFn: async () => {
      const response = await analyticsService.dashboard(period.from, period.to)
      return response.data
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}
