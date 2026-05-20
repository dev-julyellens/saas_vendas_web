import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Preferências da conta" />
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Informações do usuário autenticado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nome:</span> {user?.name}
          </p>
          <p>
            <span className="text-muted-foreground">E-mail:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Papéis:</span>{' '}
            {user?.roles?.map((r) => r.name).join(', ') || '—'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
