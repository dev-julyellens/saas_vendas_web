import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnalyticsDashboard } from '@/types/analytics'

const SalesTrendChart = lazy(() =>
  import('@/modules/dashboard/components/SalesTrendChart').then((m) => ({
    default: m.SalesTrendChart,
  })),
)
const SalesStatusChart = lazy(() =>
  import('@/modules/dashboard/components/SalesStatusChart').then((m) => ({
    default: m.SalesStatusChart,
  })),
)
const TopResellersChart = lazy(() =>
  import('@/modules/dashboard/components/TopResellersChart').then((m) => ({
    default: m.TopResellersChart,
  })),
)
const TopRepresentativesChart = lazy(() =>
  import('@/modules/dashboard/components/TopRepresentativesChart').then((m) => ({
    default: m.TopRepresentativesChart,
  })),
)
const TopProductsChart = lazy(() =>
  import('@/modules/dashboard/components/TopProductsChart').then((m) => ({
    default: m.TopProductsChart,
  })),
)
const ConsignmentOverview = lazy(() =>
  import('@/modules/dashboard/components/ConsignmentOverview').then((m) => ({
    default: m.ConsignmentOverview,
  })),
)
const IdleProductsTable = lazy(() =>
  import('@/modules/dashboard/components/IdleProductsTable').then((m) => ({
    default: m.IdleProductsTable,
  })),
)

function ChartFallback() {
  return <Skeleton className="h-[280px] w-full rounded-xl" />
}

interface DashboardChartsProps {
  data?: AnalyticsDashboard
  isLoading: boolean
  isFetching: boolean
}

export function DashboardCharts({ data, isLoading, isFetching }: DashboardChartsProps) {
  const loading = isLoading || isFetching

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<ChartFallback />}>
          <SalesTrendChart data={data?.sales_by_day} isLoading={loading} />
        </Suspense>
        <Suspense fallback={<ChartFallback />}>
          <SalesStatusChart data={data?.sales_by_status} isLoading={loading} />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartFallback />}>
          <TopResellersChart data={data?.top_resellers} isLoading={loading} />
        </Suspense>
        <Suspense fallback={<ChartFallback />}>
          <TopRepresentativesChart data={data?.top_representatives} isLoading={loading} />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartFallback />}>
          <TopProductsChart data={data?.top_products} isLoading={loading} />
        </Suspense>
        <Suspense fallback={<ChartFallback />}>
          <ConsignmentOverview data={data?.consignment} isLoading={loading} />
        </Suspense>
      </div>

      <Suspense fallback={<ChartFallback />}>
        <IdleProductsTable data={data?.idle_products} isLoading={loading} />
      </Suspense>
    </>
  )
}
