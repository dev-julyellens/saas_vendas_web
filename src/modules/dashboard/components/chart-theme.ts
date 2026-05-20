/** Cores dos gráficos — compatíveis com tema claro/escuro */
export const CHART_COLORS = {
  primary: 'hsl(264 60% 50%)',
  secondary: 'hsl(200 70% 50%)',
  success: 'hsl(142 70% 45%)',
  warning: 'hsl(38 92% 50%)',
  danger: 'hsl(0 72% 51%)',
  muted: 'hsl(220 10% 60%)',
} as const

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  'hsl(280 65% 55%)',
  'hsl(170 55% 45%)',
  'hsl(30 80% 55%)',
]

export const STATUS_COLORS: Record<string, string> = {
  draft: CHART_COLORS.muted,
  pending: CHART_COLORS.warning,
  confirmed: CHART_COLORS.success,
  cancelled: CHART_COLORS.danger,
}
