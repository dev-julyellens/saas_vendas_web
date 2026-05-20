import { useQuery } from '@tanstack/react-query'
import { format, startOfMonth } from 'date-fns'
import { DollarSign, ShoppingCart, TrendingUp, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/modules/dashboard/components/StatCard'
import { formatCurrency } from '@/lib/utils'
import { salesService } from '@/services/sales.service'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()
  const dateFrom = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const dateTo = format(new Date(), 'yyyy-MM-dd')

  const { data, isLoading } = useQuery({
    queryKey: ['sales', 'dashboard', dateFrom, dateTo],
    queryFn: async () => {
      const res = await salesService.dashboard(dateFrom, dateTo)
      return res.data
    },
  })

  const summary = data?.summary

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Olá, ${user?.name?.split(' ')[0] ?? 'usuário'}`}
        description="Visão geral das vendas do período atual"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Receita confirmada"
          value={formatCurrency(summary?.revenue_total ?? 0)}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <StatCard
          title="Vendas confirmadas"
          value={String(summary?.confirmed_sales ?? 0)}
          icon={ShoppingCart}
          isLoading={isLoading}
        />
        <StatCard
          title="Ticket médio"
          value={formatCurrency(summary?.average_ticket ?? 0)}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Canceladas"
          value={String(summary?.cancelled_sales ?? 0)}
          icon={XCircle}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top produtos</CardTitle>
            <CardDescription>Mais vendidos no período</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : data?.top_products?.length ? (
              <ul className="space-y-3">
                {data.top_products.map((p) => (
                  <li key={p.product_id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.product_name}</span>
                    <span className="text-muted-foreground">
                      {p.quantity_sold} un. · {formatCurrency(p.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados no período.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por revendedor</CardTitle>
            <CardDescription>Receita por revendedor</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : data?.by_reseller?.length ? (
              <ul className="space-y-3">
                {data.by_reseller.map((r) => (
                  <li key={r.reseller_id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{r.reseller_name ?? '—'}</span>
                    <span className="text-muted-foreground">
                      {r.sales_count} vendas · {formatCurrency(r.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados no período.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
