export interface Role {
  slug: string
  name: string
}

export interface User {
  id: string
  company_id: string | null
  name: string
  email: string
  phone?: string | null
  is_active: boolean
  is_master: boolean
  email_verified_at: string | null
  roles?: Role[]
  permissions?: string[]
  last_login_at?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  token_type: string
  expires_in: number
}

export interface RefreshResponse {
  token: string
  token_type: string
  expires_in: number
}

export interface UserSession {
  id: string
  jti: string
  ip_address: string | null
  user_agent: string | null
  last_activity_at: string | null
  created_at: string
  is_current: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  token: string
  password: string
  password_confirmation: string
}
