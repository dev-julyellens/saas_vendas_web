import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { extractApiError } from '@/services/api/client'
import { consignmentsService } from '@/services/consignments.service'
import { productsService } from '@/services/products.service'
import { resellersService } from '@/services/resellers.service'
import { representativesService } from '@/services/representatives.service'

const schema = z.object({
  reseller_id: z.string().min(1, 'Revendedor obrigatório'),
  representative_id: z.string().optional(),
  consigned_at: z.string().min(1),
  expected_return_at: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.number().min(1),
        unit_price: z.number().min(0).optional(),
      }),
    )
    .min(1),
})

type FormValues = z.infer<typeof schema>

interface ConsignmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ConsignmentFormDialog({ open, onOpenChange, onSuccess }: ConsignmentFormDialogProps) {
  const today = new Date().toISOString().slice(0, 10)

  const { data: resellers } = useQuery({
    queryKey: ['resellers', 'options'],
    queryFn: async () => (await resellersService.list({ per_page: 100, is_active: true })).items,
    enabled: open,
  })

  const { data: representatives } = useQuery({
    queryKey: ['representatives', 'options'],
    queryFn: async () => (await representativesService.list()).items,
    enabled: open,
  })

  const { data: products } = useQuery({
    queryKey: ['products', 'options'],
    queryFn: async () => (await productsService.list({ per_page: 100 })).items,
    enabled: open,
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      consigned_at: today,
      items: [{ product_id: '', quantity: 1, unit_price: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const mutation = useMutation({
    mutationFn: consignmentsService.create,
    onSuccess: (res) => {
      toast.success(res.message || 'Consignação criada.')
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova consignação</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data: FormValues) =>
            mutation.mutate({
              reseller_id: data.reseller_id,
              consigned_at: data.consigned_at,
              representative_id: data.representative_id || null,
              expected_return_at: data.expected_return_at || null,
              notes: data.notes,
              items: data.items.map((i) => ({
                product_id: i.product_id,
                quantity: Number(i.quantity),
                unit_price: i.unit_price ? Number(i.unit_price) : undefined,
              })),
            }),
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Revendedor</Label>
            <Select
              value={watch('reseller_id')}
              onValueChange={(v) => setValue('reseller_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {resellers?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Representante</Label>
            <Select
              value={watch('representative_id') ?? 'none'}
              onValueChange={(v) => setValue('representative_id', v === 'none' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Opcional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {representatives?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data consignação</Label>
              <Input type="date" {...register('consigned_at')} />
            </div>
            <div className="space-y-2">
              <Label>Previsão retorno</Label>
              <Input type="date" {...register('expected_return_at')} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Itens</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ product_id: '', quantity: 1, unit_price: 0 })}
              >
                <Plus className="h-3 w-3 mr-1" />
                Item
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end border rounded-lg p-2">
                <div className="flex-1 space-y-1">
                  <Select
                    value={watch(`items.${index}.product_id`)}
                    onValueChange={(v) => {
                      setValue(`items.${index}.product_id`, v)
                      const p = products?.find((x) => x.id === v)
                      if (p) setValue(`items.${index}.unit_price`, p.unit_price)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="number"
                  className="w-20"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.items && (
              <p className="text-sm text-destructive">{errors.items.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
