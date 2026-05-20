import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PeriodPreset } from '@/modules/dashboard/hooks/useDashboardPeriod'

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: '7d', label: '7 dias' },
  { id: 'month', label: 'Mês atual' },
  { id: 'last_month', label: 'Mês anterior' },
]

interface PeriodFilterProps {
  preset: PeriodPreset
  period: { from: string; to: string }
  onPresetChange: (preset: PeriodPreset) => void
  onCustomChange: (from: string, to: string) => void
  isFetching?: boolean
}

export function PeriodFilter({
  preset,
  period,
  onPresetChange,
  onCustomChange,
  isFetching,
}: PeriodFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.id}
            type="button"
            size="sm"
            variant={preset === p.id ? 'default' : 'outline'}
            onClick={() => onPresetChange(p.id)}
          >
            {p.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={period.from}
          className="w-[140px]"
          onChange={(e) => onCustomChange(e.target.value, period.to)}
        />
        <span className="text-muted-foreground text-sm">até</span>
        <Input
          type="date"
          value={period.to}
          className="w-[140px]"
          onChange={(e) => onCustomChange(period.from, e.target.value)}
        />
        {isFetching && (
          <span className={cn('text-xs text-muted-foreground animate-pulse')}>Atualizando…</span>
        )}
      </div>
    </div>
  )
}
