export type ConsignmentStatus = 'aberto' | 'parcial' | 'atrasado' | 'fechado'

export interface ConsignmentItem {
  id: string
  product_id: string
  product?: { sku: string; name: string }
  quantity: number
  quantity_sold: number
  quantity_returned: number
  quantity_lost: number
  quantity_damaged: number
  quantity_divergence: number
  quantity_pending: number
  unit_price: number
}

export interface Consignment {
  id: string
  code: string
  status: ConsignmentStatus
  reseller_id: string
  representative_id: string | null
  reseller?: { id: string; name: string }
  representative?: { id: string; name: string } | null
  consigned_at: string
  expected_return_at: string | null
  dispatched_at: string | null
  collected_at: string | null
  closed_at: string | null
  notes: string | null
  items?: ConsignmentItem[]
  created_at?: string
}

export interface ConsignmentFilters {
  status?: ConsignmentStatus
  reseller_id?: string
  page?: number
  per_page?: number
}

export interface ConsignmentFormData {
  reseller_id: string
  representative_id?: string | null
  consigned_at: string
  expected_return_at?: string | null
  notes?: string | null
  items: Array<{
    product_id: string
    quantity: number
    unit_price?: number
  }>
}

export interface ConsignmentItemAction {
  consignment_item_id: string
  quantity: number
  notes?: string
}
