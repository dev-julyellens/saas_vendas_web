export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled'

export interface Commission {
  id: string
  sale_id: string
  representative_id: string
  base_amount: number
  rate: number
  amount: number
  status: CommissionStatus
  paid_at: string | null
  representative?: { id: string; name: string }
  sale?: {
    id: string
    code: string
    total: number
    reseller?: { id: string; name: string } | null
  }
  created_at?: string
}

export interface CommissionFilters {
  status?: CommissionStatus
  representative_id?: string
  page?: number
  per_page?: number
}
