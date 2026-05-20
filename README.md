# SaaS Vendas — Frontend

Frontend enterprise para o sistema SaaS de vendas consignadas, integrado à API Laravel.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- shadcn/ui (Radix)
- TanStack Query + React Table
- Zustand
- React Router 7
- Axios + Zod + React Hook Form

## Início rápido

```bash
npm install
cp .env.example .env
npm run dev
```

API Laravel em `http://localhost:8080` (ajuste `VITE_API_BASE_URL` no `.env`).

### Credenciais demo

| E-mail | Senha |
|--------|-------|
| `admin@demo.com` | `password123` |

## Estrutura

```
src/
├── components/     # UI reutilizável (shadcn, data-table, layout)
├── hooks/
├── layouts/        # AuthLayout, AppLayout
├── lib/            # utils, constants
├── modules/        # Domínios (auth, dashboard, sales, products…)
├── providers/
├── routes/         # Router + guards
├── services/       # Cliente HTTP e serviços por módulo
├── stores/         # Zustand (auth, theme)
└── types/          # Tipos TypeScript alinhados à API
```

## Funcionalidades

- Autenticação JWT (login, logout, refresh, forgot/reset password)
- Guards de rota (auth, guest, permission)
- Tema claro/escuro/sistema
- Dashboard com métricas de vendas (`/sales/dashboard`)
- Listagem de vendas e produtos com tabelas, filtros e paginação
- Gestão de sessões ativas
- Error boundaries e toasts (Sonner)
- Envelope de API Laravel (`success`, `data`, `meta`, `errors`)
