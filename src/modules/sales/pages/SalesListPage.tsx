import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SALE_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { salesService } from '@/services/sales.service'
import type { Sale, SaleStatus } from '@/types/sale'

const statusVariant: Record<SaleStatus, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  draft: 'secondary',
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'destructive',
}

export function SalesListPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const debouncedCode = useDebounce(search)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sales', 'list', debouncedCode, status, pagination],
    queryFn: () =>
      salesService.list({
        code: debouncedCode || undefined,
        status: status === 'all' ? undefined : (status as SaleStatus),
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      }),
  })

  const columns = useMemo<ColumnDef<Sale>[]>(
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
            {SALE_STATUS_LABELS[row.original.status] ?? row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'reseller',
        header: 'Revendedor',
        cell: ({ row }) => row.original.reseller?.name ?? '—',
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: 'sold_at',
        header: 'Data',
        cell: ({ row }) => formatDate(row.original.sold_at ?? row.original.created_at),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Vendas" description="Gerencie vendas diretas e consignadas" />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <DataTableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por código..."
            filters={
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(SALE_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            onClear={() => {
              setSearch('')
              setStatus('all')
            }}
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
    </div>
  )
}
