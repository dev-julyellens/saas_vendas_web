# Infraestrutura — SaaS Vendas

## Visão geral

Stack containerizada para desenvolvimento, staging e produção com separação de responsabilidades e escalabilidade horizontal.

```
                    ┌─────────────┐
                    │   Gateway   │ :80 / :443
                    │   (Nginx)   │
                    └──────┬──────┘
              ┌────────────┼────────────┐
              ▼                         ▼
       ┌────────────┐            ┌─────────────┐
       │  Web (SPA) │            │  API Nginx  │
       │   Nginx    │            └──────┬──────┘
       └────────────┘                   ▼
                                 ┌─────────────┐
                                 │  PHP-FPM    │
                                 │  (Laravel)  │
                                 └──────┬──────┘
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              PostgreSQL          Redis         Queue Workers
```

## Serviços

| Serviço | Função | Escala horizontal |
|---------|--------|-------------------|
| `gateway` | Reverse proxy, rate limit, TLS | Múltiplas instâncias + LB |
| `web` | SPA estático (Vite build) | Stateless — réplicas |
| `api` | PHP-FPM Laravel | Stateless — réplicas |
| `api-nginx` | FastCGI para API | Por réplica de API |
| `postgres` | Banco principal | Réplicas read (futuro) |
| `redis` | Cache + filas | Redis Cluster / Sentinel |
| `queue` | `queue:work` | `--scale queue=N` |
| `scheduler` | Cron Laravel | **1 instância** |
| `backup` | `pg_dump` agendado | 1 instância |

## Redes

- **frontend**: gateway, web, api-nginx
- **backend**: api, postgres, redis, queue, scheduler, backup

PostgreSQL e Redis **não** são expostos em staging/produção (sem `ports` no host).

## Cache e filas

- `CACHE_STORE=redis` — analytics, RBAC, rate limit
- `QUEUE_CONNECTION=redis` — auditoria, notificações, jobs
- Workers: `php artisan queue:work redis --tries=3`

## Logs

- Laravel: `storage/logs/` (volume `api_storage`)
- Nginx: stdout do container (`docker compose logs gateway`)
- Rotação: configurar log driver `json-file` com `max-size` no daemon Docker

## Health checks

| Endpoint | Verifica |
|----------|----------|
| `GET /health` | Gateway Nginx |
| `GET /up` | Laravel (DB básico) |
| `php artisan health:check` | PostgreSQL + Redis |

## Backup

```bash
# Serviço dedicado (profile backup)
docker compose --profile backup up -d backup

# Manual
docker compose exec postgres pg_dump -U saas saas_vendas | gzip > backup.sql.gz
```

Retenção configurável via `BACKUP_RETENTION_DAYS`.

## Observabilidade (opcional)

```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml --profile observability up -d
```

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## Segurança

- Headers de segurança no Nginx (X-Frame-Options, HSTS em produção)
- Rate limit em `/api/` e login
- `server_tokens off`
- Senhas fortes via `.env` (nunca commitar)
- OPcache sem `validate_timestamps` em produção
- JWT + sessão validada na API
