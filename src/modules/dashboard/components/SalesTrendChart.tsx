import { memo, useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CHART_COLORS } from '@/modules/dashboard/components/chart-theme'
import { formatCurrency } from '@/lib/utils'
import type { SalesByDay } from '@/types/analytics'

interface SalesTrendChartProps {
  data?: SalesByDay[]
  isLoading?: boolean
}

function formatDayLabel(date: string) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

export const SalesTrendChart = memo(function SalesTrendChart({
  data = [],
  isLoading,
}: SalesTrendChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        label: formatDayLabel(d.date),
      })),
    [data],
  )

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Evolução de vendas</CardTitle>
        <CardDescription>Receita diária de vendas confirmadas</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground h-[280px] flex items-center justify-center">
            Sem vendas no período selecionado.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(v)
                }
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Receita']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ''}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
})
