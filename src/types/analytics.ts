export interface AnalyticsPeriod {
  from: string
  to: string
}

export interface AnalyticsKpis {
  sales_count: number
  confirmed_sales: number
  pending_sales: number
  cancelled_sales: number
  revenue_total: number
  average_ticket: number
  consigned_products_qty: number
  returned_products_qty: number
  overdue_consignments: number
  delinquency_amount: number
  delinquency_count: number
  idle_products_count: number
}

export interface SalesByDay {
  date: string
  revenue: number
  count: number
}

export interface SalesByStatus {
  status: string
  count: number
}

export interface TopReseller {
  reseller_id: string
  reseller_name: string | null
  sales_count: number
  revenue: number
}

export interface TopRepresentative {
  representative_id: string
  representative_name: string | null
  sales_count: number
  revenue: number
}

export interface TopProduct {
  product_id: string
  sku: string | null
  name: string | null
  quantity_sold: number
  revenue: number
}

export interface IdleProduct {
  product_id: string
  sku: string | null
  name: string | null
  days_without_sale: number
}

export interface ConsignmentMetrics {
  consigned_quantity: number
  returned_quantity: number
  open_count: number
  overdue_count: number
  closed_count: number
}

export interface AnalyticsDashboard {
  period: AnalyticsPeriod
  kpis: AnalyticsKpis
  sales_by_day: SalesByDay[]
  sales_by_status: SalesByStatus[]
  top_resellers: TopReseller[]
  top_representatives: TopRepresentative[]
  top_products: TopProduct[]
  idle_products: IdleProduct[]
  consignment: ConsignmentMetrics
}
