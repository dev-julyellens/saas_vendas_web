# Deploy — SaaS Vendas

## Pré-requisitos

- Docker 24+ e Docker Compose v2
- Repositórios `saas_vendas_api` e `saas_vendas_web` como pastas irmãs
- Domínio e certificados TLS (produção)

## Desenvolvimento local

```bash
cd saas_vendas_web/infra
cp .env.example .env
# Edite APP_KEY, JWT_SECRET (ou gere no setup)

# Windows
.\scripts\setup.ps1

# Linux/macOS
chmod +x scripts/*.sh
./scripts/setup.sh
```

Acesso: http://localhost:8080 (ou a porta `HTTP_PORT` no `.env`). Com **XAMPP**, mantenha `HTTP_PORT=8080` — a porta 80 é do Apache.

## Staging

```bash
cp .env.staging.example .env.staging
# Preencha secrets e URLs

./scripts/deploy.sh staging
```

Compose: `docker-compose.yml` + `docker-compose.staging.yml`

## Produção

```bash
cp .env.production.example .env.production
# Use vault/CI para secrets

# Certificados TLS em docker/nginx/ssl/
# fullchain.pem + privkey.pem

./scripts/deploy.sh production
```

### Escalar workers de fila

```bash
./scripts/scale-queue.sh 4 .env.production
```

### Escalar API (horizontal)

Com orquestrador (Kubernetes/Swarm):

1. Aumente réplicas de `api` + `api-nginx`
2. Configure load balancer no `gateway` (`least_conn` já preparado)
3. Garanta `api_storage` compartilhado (NFS/S3 para `storage/`) ou stateless sem uploads locais

## CI/CD

Workflows em `.github/workflows/`:

- **ci.yml** — lint + build front + testes API em PR
- **deploy-staging.yml** — deploy automático na branch `develop`
- **deploy-production.yml** — deploy manual/tag `v*`

Secrets necessários no GitHub:

- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KEY`
- `ENV_PRODUCTION` (conteúdo base64 do `.env.production`)

## Rollback

```bash
docker compose --env-file .env.production pull  # tag anterior
docker compose --env-file .env.production up -d
docker compose exec api php artisan migrate:rollback --step=1  # se necessário
```

## Checklist pós-deploy

- [ ] `scripts/healthcheck.sh` OK
- [ ] Login na API funciona
- [ ] Filas processando (`docker compose logs queue`)
- [ ] Scheduler ativo
- [ ] Backup gerado em `backup_data` volume
