import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/data-table/DataTable'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import { ResellerFormDialog } from '@/modules/resellers/components/ResellerFormDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { extractApiError } from '@/services/api/client'
import { useDebounce } from '@/hooks/useDebounce'
import { resellersService } from '@/services/resellers.service'
import type { Reseller } from '@/types/reseller'

export function ResellersListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Reseller | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reseller | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['resellers', debouncedSearch, pagination],
    queryFn: () =>
      resellersService.list({
        search: debouncedSearch || undefined,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resellersService.remove(id),
    onSuccess: () => {
      toast.success('Revendedor removido.')
      queryClient.invalidateQueries({ queryKey: ['resellers'] })
      setDeleteTarget(null)
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  const columns = useMemo<ColumnDef<Reseller>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      { accessorKey: 'document', header: 'Documento', cell: ({ row }) => row.original.document ?? '—' },
      {
        accessorKey: 'representative',
        header: 'Representante',
        cell: ({ row }) => row.original.representative?.name ?? '—',
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
            {row.original.is_active ? 'Ativo' : 'Inativo'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(row.original)
                setFormOpen(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revendedores"
        description="Cadastro de revendedores e carteira"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo revendedor
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <DataTableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome, documento ou e-mail..."
            onClear={() => setSearch('')}
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

      <ResellerFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o)
          if (!o) setEditing(null)
        }}
        reseller={editing}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['resellers'] })}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir revendedor</DialogTitle>
            <DialogDescription>
              Remover {deleteTarget?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
