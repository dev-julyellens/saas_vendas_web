import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { DashboardCharts } from '@/modules/dashboard/components/DashboardCharts'
import { KpiGrid } from '@/modules/dashboard/components/KpiGrid'
import { PeriodFilter } from '@/modules/dashboard/components/PeriodFilter'
import { useAnalyticsDashboard } from '@/modules/dashboard/hooks/useAnalyticsDashboard'
import { useDashboardPeriod } from '@/modules/dashboard/hooks/useDashboardPeriod'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()
  const { preset, period, setPreset, setCustomRange } = useDashboardPeriod('month')

  const { data, isLoading, isFetching, refetch, isRefetching } = useAnalyticsDashboard(period)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Olá, ${user?.name?.split(' ')[0] ?? 'usuário'}`}
        description="Dashboard analítico — indicadores e métricas do negócio"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        }
      />

      <PeriodFilter
        preset={preset}
        period={period}
        onPresetChange={setPreset}
        onCustomChange={setCustomRange}
        isFetching={isFetching && !isLoading}
      />

      <KpiGrid kpis={data?.kpis} isLoading={isLoading} />

      <DashboardCharts data={data} isLoading={isLoading} isFetching={isFetching} />
    </div>
  )
}
