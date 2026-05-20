export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'SaaS Vendas'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'
export const TOKEN_STORAGE_KEY = 'saas_vendas_token'
export const TOKEN_EXPIRES_KEY = 'saas_vendas_token_expires'

export const ROUTES = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/',
  sales: '/sales',
  products: '/products',
  consignments: '/consignments',
  customers: '/customers',
  representatives: '/representatives',
  resellers: '/resellers',
  commissions: '/commissions',
  financial: '/financial',
  settings: '/settings',
  sessions: '/settings/sessions',
} as const

export const SALE_STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

export const CONSIGNMENT_STATUS_LABELS: Record<string, string> = {
  aberto: 'Aberto',
  parcial: 'Parcial',
  atrasado: 'Atrasado',
  fechado: 'Fechado',
}

export const COMMISSION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  paid: 'Paga',
  cancelled: 'Cancelada',
}
