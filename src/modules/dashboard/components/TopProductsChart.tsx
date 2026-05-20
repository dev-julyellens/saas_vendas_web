import { memo, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CHART_COLORS } from '@/modules/dashboard/components/chart-theme'
import { formatCurrency } from '@/lib/utils'
import type { TopProduct } from '@/types/analytics'

interface TopProductsChartProps {
  data?: TopProduct[]
  isLoading?: boolean
}

export const TopProductsChart = memo(function TopProductsChart({
  data = [],
  isLoading,
}: TopProductsChartProps) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        name: p.name ?? p.sku ?? '—',
        revenue: p.revenue,
        qty: p.quantity_sold,
      })),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top produtos</CardTitle>
        <CardDescription>Mais vendidos por receita</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground h-[260px] flex items-center justify-center">
            Sem produtos vendidos.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'revenue'
                    ? formatCurrency(Number(value ?? 0))
                    : `${value ?? 0} un.`
                }
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                }}
              />
              <Bar dataKey="revenue" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
