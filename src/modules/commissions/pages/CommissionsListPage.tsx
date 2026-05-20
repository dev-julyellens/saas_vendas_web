import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COMMISSION_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { extractApiError } from '@/services/api/client'
import { commissionsService } from '@/services/commissions.service'
import type { Commission, CommissionStatus } from '@/types/commission'

const statusVariant: Record<
  CommissionStatus,
  'secondary' | 'warning' | 'success' | 'destructive'
> = {
  pending: 'warning',
  approved: 'secondary',
  paid: 'success',
  cancelled: 'destructive',
}

export function CommissionsListPage() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<string>('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['commissions', status, pagination],
    queryFn: () =>
      commissionsService.list({
        status: status === 'all' ? undefined : (status as CommissionStatus),
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: CommissionStatus }) =>
      commissionsService.updateStatus(id, newStatus),
    onSuccess: (res) => {
      toast.success(res.message || 'Status atualizado.')
      queryClient.invalidateQueries({ queryKey: ['commissions'] })
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  const columns = useMemo<ColumnDef<Commission>[]>(
    () => [
      {
        accessorKey: 'sale',
        header: 'Venda',
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.sale?.code ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'representative',
        header: 'Representante',
        cell: ({ row }) => row.original.representative?.name ?? '—',
      },
      {
        accessorKey: 'amount',
        header: 'Comissão',
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        accessorKey: 'rate',
        header: 'Taxa',
        cell: ({ row }) => `${(row.original.rate * 100).toFixed(2)}%`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]}>
            {COMMISSION_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const c = row.original
          if (c.status === 'cancelled' || c.status === 'paid') return null
          return (
            <div className="flex gap-1 justify-end">
              {c.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={statusMutation.isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: c.id, newStatus: 'approved' })
                  }
                >
                  Aprovar
                </Button>
              )}
              {(c.status === 'pending' || c.status === 'approved') && (
                <Button
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate({ id: c.id, newStatus: 'paid' })}
                >
                  Pagar
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    [statusMutation],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comissões"
        description="Comissões geradas a partir de vendas confirmadas"
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <DataTableToolbar
            filters={
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(COMMISSION_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            onClear={() => setStatus('all')}
          />
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            meta={data?.meta}
            isLoading={isLoading || isFetching}
            pagination={pagination}
            onPaginationChange={setPagination}
            emptyMessage="Nenhuma comissão encontrada. Confirme vendas com representante para gerar comissões."
          />
        </CardContent>
      </Card>
    </div>
  )
}
