import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { representativesService } from '@/services/representatives.service'
import { resellersService } from '@/services/resellers.service'
import type { Reseller } from '@/types/reseller'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  document: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  representative_id: z.string().optional(),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface ResellerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reseller?: Reseller | null
  onSuccess?: () => void
}

export function ResellerFormDialog({
  open,
  onOpenChange,
  reseller,
  onSuccess,
}: ResellerFormDialogProps) {
  const isEdit = !!reseller

  const { data: representatives } = useQuery({
    queryKey: ['representatives', 'options'],
    queryFn: async () => {
      const res = await representativesService.list()
      return res.items
    },
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true },
  })

  useEffect(() => {
    if (open && reseller) {
      reset({
        name: reseller.name,
        document: reseller.document ?? '',
        email: reseller.email ?? '',
        phone: reseller.phone ?? '',
        representative_id: reseller.representative_id ?? undefined,
        is_active: reseller.is_active,
      })
    } else if (open) {
      reset({ name: '', document: '', email: '', phone: '', is_active: true })
    }
  }, [open, reseller, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = {
        ...data,
        email: data.email || undefined,
        representative_id: data.representative_id || null,
      }
      return isEdit
        ? resellersService.update(reseller!.id, payload)
        : resellersService.create(payload)
    },
    onSuccess: (res) => {
      toast.success(res.message || (isEdit ? 'Revendedor atualizado.' : 'Revendedor criado.'))
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar revendedor' : 'Novo revendedor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Documento</Label>
              <Input {...register('document')} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input {...register('phone')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" {...register('email')} />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
