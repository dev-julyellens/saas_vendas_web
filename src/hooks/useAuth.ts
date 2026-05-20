import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@/lib/constants'
import { extractApiError, getStoredToken } from '@/services/api/client'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginPayload } from '@/types/auth'

export const AUTH_QUERY_KEY = ['auth', 'me'] as const

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, isHydrated, setUser, logout: clearAuth } = useAuthStore()

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await authService.me()
      return response.data
    },
    enabled: isHydrated && (!!isAuthenticated || !!getStoredToken()),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
    }
  }, [meQuery.data, setUser])

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (response) => {
      if (response.data?.user) {
        setUser(response.data.user)
        await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
        toast.success(response.message || 'Login realizado com sucesso.')
        navigate(ROUTES.dashboard)
      }
    },
    onError: (error) => {
      toast.error(extractApiError(error))
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate(ROUTES.login)
    },
  })

  return {
    user: meQuery.data ?? user,
    isAuthenticated,
    isHydrated,
    isLoading: meQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: meQuery.refetch,
  }
}
