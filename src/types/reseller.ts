export interface Reseller {
  id: string
  representative_id: string | null
  name: string
  document: string | null
  email: string | null
  phone: string | null
  is_active: boolean
  representative?: { id: string; name: string } | null
  created_at?: string
}

export interface ResellerFilters {
  search?: string
  is_active?: boolean
  representative_id?: string
  page?: number
  per_page?: number
}

export interface ResellerFormData {
  representative_id?: string | null
  name: string
  document?: string
  email?: string
  phone?: string
  is_active: boolean
}
