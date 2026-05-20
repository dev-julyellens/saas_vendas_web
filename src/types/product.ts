export interface Product {
  id: string
  company_id: string
  sku: string
  name: string
  description: string | null
  unit_price: number
  cost_price: number | null
  is_active: boolean
  created_at?: string
}

export interface ProductFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface ProductFormData {
  sku: string
  name: string
  description?: string
  unit_price: number
  cost_price?: number
  is_active: boolean
}
