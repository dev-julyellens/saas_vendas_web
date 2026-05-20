import {
  AlertTriangle,
  DollarSign,
  Handshake,
  PackageX,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import { StatCard } from '@/modules/dashboard/components/StatCard'
import { formatCurrency } from '@/lib/utils'
import type { AnalyticsKpis } from '@/types/analytics'

interface KpiGridProps {
  kpis?: AnalyticsKpis
  isLoading?: boolean
}

export function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Vendas no período"
        value={String(kpis?.sales_count ?? 0)}
        description={`${kpis?.confirmed_sales ?? 0} confirmadas`}
        icon={ShoppingCart}
        isLoading={isLoading}
      />
      <StatCard
        title="Receita confirmada"
        value={formatCurrency(kpis?.revenue_total ?? 0)}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <StatCard
        title="Ticket médio"
        value={formatCurrency(kpis?.average_ticket ?? 0)}
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <StatCard
        title="Produtos consignados"
        value={String(kpis?.consigned_products_qty ?? 0)}
        description="Unidades enviadas"
        icon={Handshake}
        isLoading={isLoading}
      />
      <StatCard
        title="Produtos devolvidos"
        value={String(kpis?.returned_products_qty ?? 0)}
        description="Devoluções parciais"
        icon={RotateCcw}
        isLoading={isLoading}
      />
      <StatCard
        title="Consignados atrasados"
        value={String(kpis?.overdue_consignments ?? 0)}
        icon={AlertTriangle}
        trend={kpis && kpis.overdue_consignments > 0 ? 'down' : 'neutral'}
        isLoading={isLoading}
      />
      <StatCard
        title="Inadimplência"
        value={formatCurrency(kpis?.delinquency_amount ?? 0)}
        description={`${kpis?.delinquency_count ?? 0} títulos em aberto`}
        icon={AlertTriangle}
        trend={kpis && kpis.delinquency_amount > 0 ? 'down' : 'neutral'}
        isLoading={isLoading}
      />
      <StatCard
        title="Produtos parados"
        value={String(kpis?.idle_products_count ?? 0)}
        description="Sem venda no período"
        icon={PackageX}
        isLoading={isLoading}
      />
    </div>
  )
}
