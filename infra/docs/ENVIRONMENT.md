# Variáveis de ambiente

## Infraestrutura (`infra/.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `API_PATH` | Caminho do repositório API | `../../saas_vendas_api` |
| `WEB_PATH` | Caminho do frontend | `..` |
| `HTTP_PORT` | Porta do gateway (use **8080** com XAMPP) | `8080` |
| `APP_ENV` | `local` / `staging` / `production` | `local` |
| `VITE_API_BASE_URL` | URL pública da API (build SPA) | `http://localhost/api/v1` |
| `DB_*` | PostgreSQL | ver `.env.example` |
| `REDIS_PASSWORD` | Senha Redis (prod obrigatório) | — |
| `QUEUE_WORKERS` | Réplicas de fila | `2` |
| `BACKUP_RETENTION_DAYS` | Retenção de backups | `14` |

## API Laravel (`saas_vendas_api/.env`)

Sincronize com o stack:

```env
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:8080
DB_HOST=postgres
REDIS_HOST=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

## Frontend (`saas_vendas_web/.env`)

Desenvolvimento Vite (sem Docker):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Com stack unificado (`infra`):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### XAMPP (Windows)

Com o projeto em `htdocs`, o Apache do XAMPP responde em `http://localhost` (porta 80). O Docker **não** substitui isso automaticamente. Defina `HTTP_PORT=8080` em `infra/.env` e acesse **http://localhost:8080/login**.

## Geração de secrets

```bash
# APP_KEY
docker compose exec api php artisan key:generate --show

# JWT
docker compose exec api php artisan jwt:secret
```

Nunca commite `.env`, `.env.staging` ou `.env.production`.
