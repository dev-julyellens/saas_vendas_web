import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Package, Truck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CONSIGNMENT_STATUS_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { extractApiError } from '@/services/api/client'
import { consignmentsService } from '@/services/consignments.service'
import type { ConsignmentStatus } from '@/types/consignment'

const statusVariant: Record<
  ConsignmentStatus,
  'secondary' | 'warning' | 'success' | 'destructive'
> = {
  aberto: 'secondary',
  parcial: 'warning',
  atrasado: 'destructive',
  fechado: 'success',
}

interface ConsignmentDetailDialogProps {
  consignmentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConsignmentDetailDialog({
  consignmentId,
  open,
  onOpenChange,
}: ConsignmentDetailDialogProps) {
  const queryClient = useQueryClient()
  const [actionQty, setActionQty] = useState<Record<string, number>>({})

  const { data: consignment, isLoading } = useQuery({
    queryKey: ['consignments', consignmentId],
    queryFn: async () => {
      const res = await consignmentsService.getById(consignmentId!)
      return res.data
    },
    enabled: open && !!consignmentId,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['consignments'] })
    if (consignmentId) {
      queryClient.invalidateQueries({ queryKey: ['consignments', consignmentId] })
    }
  }

  const actionMutation = useMutation({
    mutationFn: async ({
      action,
      itemId,
      qty,
    }: {
      action: 'dispatch' | 'sale' | 'return' | 'collect' | 'close'
      itemId?: string
      qty?: number
    }) => {
      if (!consignmentId) return
      switch (action) {
        case 'dispatch':
          return consignmentsService.dispatch(consignmentId)
        case 'sale':
          return consignmentsService.partialSale(consignmentId, {
            consignment_item_id: itemId!,
            quantity: qty!,
          })
        case 'return':
          return consignmentsService.partialReturn(consignmentId, {
            consignment_item_id: itemId!,
            quantity: qty!,
          })
        case 'collect':
          return consignmentsService.collect(consignmentId)
        case 'close':
          return consignmentsService.close(consignmentId)
      }
    },
    onSuccess: (res) => {
      toast.success(res?.message || 'Operação realizada.')
      invalidate()
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  const canOperate = consignment && consignment.status !== 'fechado'
  const isDispatched = !!consignment?.dispatched_at

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Consignação {consignment?.code ?? ''}
            {consignment && (
              <Badge variant={statusVariant[consignment.status]}>
                {CONSIGNMENT_STATUS_LABELS[consignment.status]}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : consignment ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Revendedor</span>
                <p className="font-medium">{consignment.reseller?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Representante</span>
                <p className="font-medium">{consignment.representative?.name ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Consignado em</span>
                <p>{formatDate(consignment.consigned_at)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Previsão retorno</span>
                <p>{formatDate(consignment.expected_return_at)}</p>
              </div>
            </div>

            {canOperate && (
              <div className="flex flex-wrap gap-2">
                {!isDispatched && (
                  <Button
                    size="sm"
                    onClick={() => actionMutation.mutate({ action: 'dispatch' })}
                    disabled={actionMutation.isPending}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Enviar
                  </Button>
                )}
                {isDispatched && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => actionMutation.mutate({ action: 'collect' })}
                      disabled={actionMutation.isPending}
                    >
                      Coletar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => actionMutation.mutate({ action: 'close' })}
                      disabled={actionMutation.isPending}
                    >
                      Fechar
                    </Button>
                  </>
                )}
              </div>
            )}

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Pendente</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  {canOperate && isDispatched && <TableHead />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {consignment.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.product?.name}</div>
                      <div className="text-xs text-muted-foreground">{item.product?.sku}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.quantity_pending}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                    {canOperate && isDispatched && item.quantity_pending > 0 && (
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <Input
                            type="number"
                            min={1}
                            max={item.quantity_pending}
                            className="w-16 h-8"
                            value={actionQty[item.id] ?? 1}
                            onChange={(e) =>
                              setActionQty((s) => ({
                                ...s,
                                [item.id]: Number(e.target.value),
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionMutation.isPending}
                            onClick={() =>
                              actionMutation.mutate({
                                action: 'sale',
                                itemId: item.id,
                                qty: actionQty[item.id] ?? 1,
                              })
                            }
                          >
                            Venda
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={actionMutation.isPending}
                            onClick={() =>
                              actionMutation.mutate({
                                action: 'return',
                                itemId: item.id,
                                qty: actionQty[item.id] ?? 1,
                              })
                            }
                          >
                            Devol.
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
