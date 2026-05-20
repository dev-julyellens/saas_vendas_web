export interface Representative {
  id: string
  name: string
  email: string | null
  phone: string | null
  commission_rate: number
  is_active: boolean
}
