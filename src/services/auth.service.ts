import { persistToken, clearSession } from '@/services/api/client'
import { get, post, del } from '@/services/api/http'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  User,
  UserSession,
} from '@/types/auth'

export const authService = {
  async login(payload: LoginPayload) {
    const response = await post<LoginResponse>('/auth/login', payload)
    if (response.data) {
      persistToken(response.data.token, response.data.expires_in)
    }
    return response
  },

  async logout() {
    try {
      await post('/auth/logout')
    } finally {
      clearSession()
    }
  },

  async me() {
    return get<User>('/auth/me')
  },

  async refresh() {
    return post<{ token: string; token_type: string; expires_in: number }>('/auth/refresh')
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    return post('/auth/forgot-password', payload)
  },

  async resetPassword(payload: ResetPasswordPayload) {
    return post('/auth/reset-password', payload)
  },

  async listSessions() {
    return get<UserSession[]>('/auth/sessions')
  },

  async revokeSession(sessionId: string) {
    return del(`/auth/sessions/${sessionId}`)
  },

  async revokeAllSessions() {
    return del<{ revoked: number }>('/auth/sessions')
  },
}
