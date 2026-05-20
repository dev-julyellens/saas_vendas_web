import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description ?? 'Módulo em desenvolvimento na API.'} />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-sm">Em breve — aguardando implementação no backend Laravel.</p>
        </CardContent>
      </Card>
    </div>
  )
}
