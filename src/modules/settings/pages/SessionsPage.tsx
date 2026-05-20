import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Monitor, Smartphone, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { extractApiError } from '@/services/api/client'
import { authService } from '@/services/auth.service'
import { formatDate } from '@/lib/utils'

export function SessionsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const res = await authService.listSessions()
      return res.data ?? []
    },
  })

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: (res) => {
      toast.success(res.message || 'Sessão revogada.')
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  const revokeAllMutation = useMutation({
    mutationFn: () => authService.revokeAllSessions(),
    onSuccess: (res) => {
      toast.success(res.message || 'Sessões revogadas.')
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    },
    onError: (err) => toast.error(extractApiError(err)),
  })

  if (isLoading) return <LoadingSpinner className="py-12" />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessões ativas"
        description="Dispositivos conectados à sua conta"
        actions={
          <Button
            variant="destructive"
            size="sm"
            disabled={revokeAllMutation.isPending}
            onClick={() => revokeAllMutation.mutate()}
          >
            Revogar todas
          </Button>
        }
      />

      <div className="grid gap-4">
        {data?.map((session) => (
          <Card key={session.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                {session.user_agent?.toLowerCase().includes('mobile') ? (
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <CardTitle className="text-base">
                    {session.ip_address ?? 'IP desconhecido'}
                    {session.is_current && (
                      <Badge variant="success" className="ml-2">
                        Atual
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {session.user_agent ?? 'Agente desconhecido'}
                  </CardDescription>
                </div>
              </div>
              {!session.is_current && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={revokeMutation.isPending}
                  onClick={() => revokeMutation.mutate(session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Última atividade: {formatDate(session.last_activity_at, { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>
        ))}
        {!data?.length && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma sessão encontrada.</p>
        )}
      </div>
    </div>
  )
}
