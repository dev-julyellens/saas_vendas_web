import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL, TOKEN_EXPIRES_KEY, TOKEN_STORAGE_KEY } from '@/lib/constants'
import type { ApiErrorResponse } from '@/types/api'

let refreshPromise: Promise<string | null> | null = null

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const isAuthRoute = originalRequest.url?.includes('/auth/login')
      if (isAuthRoute) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }

      clearSession()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
          Accept: 'application/json',
        },
      },
    )

    if (data.success && data.data?.token) {
      persistToken(data.data.token, data.data.expires_in)
      return data.data.token as string
    }
  } catch {
    // refresh failed
  }
  return null
}

export function persistToken(token: string, expiresInSeconds: number) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  const expiresAt = Date.now() + expiresInSeconds * 1000
  localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data
    if (data?.message) return data.message
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first?.[0]) return first[0]
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}
