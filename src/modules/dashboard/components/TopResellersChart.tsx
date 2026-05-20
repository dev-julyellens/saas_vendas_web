import { memo, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CHART_COLORS } from '@/modules/dashboard/components/chart-theme'
import { formatCurrency } from '@/lib/utils'
import type { TopReseller } from '@/types/analytics'

interface TopResellersChartProps {
  data?: TopReseller[]
  isLoading?: boolean
}

export const TopResellersChart = memo(function TopResellersChart({
  data = [],
  isLoading,
}: TopResellersChartProps) {
  const chartData = useMemo(
    () =>
      data.map((r) => ({
        name: r.reseller_name ?? '—',
        revenue: r.revenue,
        sales: r.sales_count,
      })),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top revendedores</CardTitle>
        <CardDescription>Por receita no período</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground h-[260px] flex items-center justify-center">
            Sem revendedores no período.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'revenue' ? formatCurrency(Number(value ?? 0)) : String(value ?? 0)
                }
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                }}
              />
              <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
