import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { ConsignmentDetailDialog } from '@/modules/consignments/components/ConsignmentDetailDialog'
import { ConsignmentFormDialog } from '@/modules/consignments/components/ConsignmentFormDialog'
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
import { CONSIGNMENT_STATUS_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { consignmentsService } from '@/services/consignments.service'
import type { Consignment, ConsignmentStatus } from '@/types/consignment'

const statusVariant: Record<
  ConsignmentStatus,
  'secondary' | 'warning' | 'success' | 'destructive'
> = {
  aberto: 'secondary',
  parcial: 'warning',
  atrasado: 'destructive',
  fechado: 'success',
}

export function ConsignmentsListPage() {
  const [status, setStatus] = useState<string>('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })
  const [formOpen, setFormOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['consignments', 'list', status, pagination],
    queryFn: () =>
      consignmentsService.list({
        status: status === 'all' ? undefined : (status as ConsignmentStatus),
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      }),
  })

  const columns = useMemo<ColumnDef<Consignment>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.code}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]}>
            {CONSIGNMENT_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'reseller',
        header: 'Revendedor',
        cell: ({ row }) => row.original.reseller?.name ?? '—',
      },
      {
        accessorKey: 'consigned_at',
        header: 'Consignado',
        cell: ({ row }) => formatDate(row.original.consigned_at),
      },
      {
        accessorKey: 'expected_return_at',
        header: 'Retorno prev.',
        cell: ({ row }) => formatDate(row.original.expected_return_at),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="ghost" size="icon" onClick={() => setDetailId(row.original.id)}>
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consignações"
        description="Gestão de remessas consignadas"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova consignação
          </Button>
        }
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
                  {Object.entries(CONSIGNMENT_STATUS_LABELS).map(([value, label]) => (
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
          />
        </CardContent>
      </Card>

      <ConsignmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => refetch()}
      />

      <ConsignmentDetailDialog
        consignmentId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
      />
    </div>
  )
}
