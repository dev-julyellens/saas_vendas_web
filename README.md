# SaaS Vendas Consignadas

Sistema SaaS multi-tenant para gestão de vendas consignadas — **frontend React** + **API Laravel**.

## Repositórios

| Projeto | Stack | Pasta |
|---------|-------|-------|
| **Frontend** (este repo) | React 19, TypeScript, Vite, Tailwind, shadcn/ui | `saas_vendas_web` |
| **API** | Laravel 12, PostgreSQL, Redis, JWT | `saas_vendas_api` |

## Início rápido — stack completo (recomendado)

Requisito: Docker 24+ e API clonada em `../saas_vendas_api`.

```powershell
cd infra
copy .env.example .env
.\scripts\setup.ps1
```

Acesse **http://localhost:8080** — SPA e API no gateway Docker (porta **8080** evita conflito com o Apache do XAMPP na 80).

Documentação completa: **[infra/README.md](infra/README.md)**

## Desenvolvimento — apenas frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Stack unificada: `http://localhost:8080` (login em `/login`). Só frontend: `npm run dev` + API na mesma porta ou em `saas_vendas_api` isolada.

### Credenciais demo

| E-mail | Senha |
|--------|-------|
| `admin@demo.com` | `password123` |

## Funcionalidades

- Autenticação JWT, guards, RBAC, sessões
- Dashboard analítico (KPIs, gráficos Recharts, filtros de período)
- Módulos: vendas, produtos, consignações (placeholder), configurações
- Tema claro/escuro, tabelas avançadas, formulários validados (Zod)

## Arquitetura frontend

```
src/
├── modules/        # Domínios (auth, dashboard, sales, products…)
├── services/       # Cliente HTTP + serviços API
├── stores/         # Zustand (auth, theme)
├── routes/guards/  # Auth, guest, permission
├── components/     # UI shadcn, data-table, layout
└── types/          # TypeScript alinhado à API
```

## Infraestrutura

| Recurso | Local |
|---------|-------|
| Docker Compose (full stack) | [`infra/`](infra/) |
| Staging / Produção | `docker-compose.staging.yml`, `docker-compose.prod.yml` |
| CI/CD | `.github/workflows/` |
| Deploy | `infra/scripts/deploy.sh` |
| Backup PostgreSQL | serviço `backup` + volume `backup_data` |
| Observabilidade | Prometheus + Grafana (profile opcional) |

### Escalabilidade

- **API stateless** — escale réplicas `api` + load balancer
- **Filas** — `./infra/scripts/scale-queue.sh N`
- **Cache Redis** — analytics, sessões, rate limit
- **Scheduler** — uma única instância

## Documentação

### Frontend
- Este README

### Infraestrutura
- [infra/README.md](infra/README.md)
- [Infraestrutura](infra/docs/INFRASTRUCTURE.md)
- [Deploy](infra/docs/DEPLOYMENT.md)
- [Variáveis de ambiente](infra/docs/ENVIRONMENT.md)

### API (`saas_vendas_api`)
- [README API](../saas_vendas_api/README.md)
- [Arquitetura](../saas_vendas_api/docs/ARCHITECTURE.md)
- [API Auth](../saas_vendas_api/docs/API_AUTH.md)

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Vite dev server |
| `npm run build` | Build produção |
| `infra/scripts/setup.ps1` | Setup Docker completo |
| `infra/scripts/deploy.sh staging` | Deploy staging |
| `infra/scripts/healthcheck.sh` | Verificar saúde do stack |

## Segurança

- Nunca commite `.env` com secrets
- Produção: `APP_DEBUG=false`, senhas Redis/DB fortes, TLS no gateway
- Rate limit Nginx em staging/produção
- JWT blacklist + validação de sessão na API

## Licença

Projeto proprietário — uso interno.
