import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConsignmentMetrics } from '@/types/analytics'

interface ConsignmentOverviewProps {
  data?: ConsignmentMetrics
  isLoading?: boolean
}

export const ConsignmentOverview = memo(function ConsignmentOverview({
  data,
  isLoading,
}: ConsignmentOverviewProps) {
  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />
  }

  const items = [
    { label: 'Em aberto', value: data?.open_count ?? 0, color: 'bg-primary/15 text-primary' },
    { label: 'Atrasados', value: data?.overdue_count ?? 0, color: 'bg-destructive/15 text-destructive' },
    { label: 'Fechados', value: data?.closed_count ?? 0, color: 'bg-muted text-muted-foreground' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consignações</CardTitle>
        <CardDescription>Status atual da carteira consignada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className={`rounded-lg p-4 text-center ${item.color}`}
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-t pt-4">
          <div>
            <p className="text-muted-foreground">Enviados no período</p>
            <p className="font-semibold text-lg">{data?.consigned_quantity ?? 0} un.</p>
          </div>
          <div>
            <p className="text-muted-foreground">Devolvidos no período</p>
            <p className="font-semibold text-lg">{data?.returned_quantity ?? 0} un.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
