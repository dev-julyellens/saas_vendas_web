export type SaleStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled'

export interface SaleItem {
  id?: string
  product_id: string
  quantity: number
  unit_price: number
  consignment_item_id?: string | null
  product?: { id: string; name: string; sku?: string }
}

export interface Sale {
  id: string
  code: string
  status: SaleStatus
  reseller_id: string
  customer_id: string | null
  representative_id: string | null
  consignment_id: string | null
  subtotal: number
  discount: number
  total: number
  sold_at: string | null
  reseller?: { id: string; name: string }
  customer?: { id: string; name: string } | null
  representative?: { id: string; name: string } | null
  consignment?: { id: string; code: string } | null
  items?: SaleItem[]
  created_at?: string
  updated_at?: string
}

export interface SaleFilters {
  status?: SaleStatus
  reseller_id?: string
  customer_id?: string
  representative_id?: string
  consignment_id?: string
  code?: string
  date_from?: string
  date_to?: string
  min_total?: number
  max_total?: number
  confirmed_only?: boolean
  page?: number
  per_page?: number
}

export interface SalesDashboard {
  period: { from: string; to: string }
  summary: {
    total_sales: number
    confirmed_sales: number
    pending_sales: number
    cancelled_sales: number
    revenue_total: number
    average_ticket: number
  }
  top_products: Array<{
    product_id: string
    product_name: string
    quantity_sold: number
    revenue: number
  }>
  by_reseller: Array<{
    reseller_id: string
    reseller_name: string
    sales_count: number
    revenue: number
  }>
}
