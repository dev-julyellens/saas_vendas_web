import { memo, useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CHART_PALETTE, STATUS_COLORS } from '@/modules/dashboard/components/chart-theme'
import { SALE_STATUS_LABELS } from '@/lib/constants'
import type { SalesByStatus } from '@/types/analytics'

interface SalesStatusChartProps {
  data?: SalesByStatus[]
  isLoading?: boolean
}

export const SalesStatusChart = memo(function SalesStatusChart({
  data = [],
  isLoading,
}: SalesStatusChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: SALE_STATUS_LABELS[d.status] ?? d.status,
        value: d.count,
        status: d.status,
      })),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por status</CardTitle>
        <CardDescription>Distribuição no período</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground h-[280px] flex items-center justify-center">
            Sem dados.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? CHART_PALETTE[i % CHART_PALETTE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
