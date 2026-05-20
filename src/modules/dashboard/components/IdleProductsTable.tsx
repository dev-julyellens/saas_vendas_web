import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { IdleProduct } from '@/types/analytics'

interface IdleProductsTableProps {
  data?: IdleProduct[]
  isLoading?: boolean
}

export const IdleProductsTable = memo(function IdleProductsTable({
  data = [],
  isLoading,
}: IdleProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos parados</CardTitle>
        <CardDescription>Ativos sem venda no período</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Todos os produtos ativos tiveram vendas no período.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Dias parado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell className="font-mono text-xs">{p.sku ?? '—'}</TableCell>
                  <TableCell>{p.name ?? '—'}</TableCell>
                  <TableCell className="text-right">{p.days_without_sale}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
})
