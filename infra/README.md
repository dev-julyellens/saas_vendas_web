# Infraestrutura — SaaS Vendas Consignadas

Orquestração Docker completa do sistema: **API Laravel**, **SPA React**, **PostgreSQL**, **Redis**, filas, scheduler, backup e observabilidade.

## Início rápido

```powershell
# Windows (PowerShell)
cd infra
copy .env.example .env
.\scripts\setup.ps1
```

```bash
# Linux / macOS
cd infra
cp .env.example .env
chmod +x scripts/*.sh
./scripts/setup.sh
```

| Recurso | URL |
|---------|-----|
| Aplicação (SPA + API) | http://localhost:8080 |
| API | http://localhost:8080/api/v1 |
| Health | http://localhost:8080/health |
| Laravel `/up` | http://localhost:8080/up |

> **XAMPP:** o Apache usa a porta 80. O stack Docker publica o gateway em `HTTP_PORT` (padrão **8080** no `.env.example`).

**Login demo:** `admin@demo.com` / `password123`

## Estrutura

```
infra/
├── docker-compose.yml           # Stack base (dev)
├── docker-compose.staging.yml   # Overrides staging
├── docker-compose.prod.yml      # Overrides produção
├── docker-compose.observability.yml
├── docker/
│   ├── api/Dockerfile           # PHP 8.3 multi-stage
│   ├── web/Dockerfile           # Vite + Nginx
│   └── nginx/                   # Gateway, API, TLS
├── scripts/
│   ├── setup.ps1 / setup.sh
│   ├── deploy.sh
│   ├── healthcheck.sh
│   ├── scale-queue.sh
│   └── backup-entrypoint.sh
└── docs/
    ├── INFRASTRUCTURE.md
    ├── DEPLOYMENT.md
    └── ENVIRONMENT.md
```

## Comandos úteis

```bash
# Logs
docker compose logs -f gateway api queue

# Escalar filas
./scripts/scale-queue.sh 3

# Deploy staging
./scripts/deploy.sh staging

# Backup manual
docker compose --profile backup up -d backup

# Observabilidade
docker compose -f docker-compose.yml -f docker-compose.observability.yml --profile observability up -d
```

## Requisitos

- Docker 24+ / Compose v2
- Repositório API em `../../saas_vendas_api` (padrão XAMPP/htdocs)

## Documentação

- [Arquitetura de infra](docs/INFRASTRUCTURE.md)
- [Deploy](docs/DEPLOYMENT.md)
- [Variáveis de ambiente](docs/ENVIRONMENT.md)

## CI/CD

Workflows GitHub em `saas_vendas_web/.github/workflows/`:

- `ci.yml` — lint, build, testes
- `deploy-staging.yml` — branch `develop`
- `deploy-production.yml` — tags `v*.*.*`
