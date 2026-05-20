import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import type { AnalyticsPeriod } from '@/types/analytics'

export type PeriodPreset = 'today' | '7d' | 'month' | 'last_month' | 'custom'

function toIsoDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function rangeFromPreset(preset: PeriodPreset): AnalyticsPeriod {
  const now = new Date()
  switch (preset) {
    case 'today':
      return { from: toIsoDate(startOfDay(now)), to: toIsoDate(endOfDay(now)) }
    case '7d':
      return { from: toIsoDate(startOfDay(subDays(now, 6))), to: toIsoDate(endOfDay(now)) }
    case 'last_month': {
      const prev = subMonths(now, 1)
      return {
        from: toIsoDate(startOfMonth(prev)),
        to: toIsoDate(endOfMonth(prev)),
      }
    }
    case 'month':
    default:
      return {
        from: toIsoDate(startOfMonth(now)),
        to: toIsoDate(endOfDay(now)),
      }
  }
}

export function useDashboardPeriod(initialPreset: PeriodPreset = 'month') {
  const [preset, setPreset] = useState<PeriodPreset>(initialPreset)
  const [customPeriod, setCustomPeriod] = useState<AnalyticsPeriod>(() =>
    rangeFromPreset(initialPreset),
  )

  const period = useMemo(
    () => (preset === 'custom' ? customPeriod : rangeFromPreset(preset)),
    [preset, customPeriod],
  )

  const setPresetSafe = useCallback((next: PeriodPreset) => {
    setPreset(next)
    if (next !== 'custom') {
      setCustomPeriod(rangeFromPreset(next))
    }
  }, [])

  const setCustomRange = useCallback((from: string, to: string) => {
    setPreset('custom')
    setCustomPeriod({ from, to })
  }, [])

  return { preset, period, setPreset: setPresetSafe, setCustomRange }
}
