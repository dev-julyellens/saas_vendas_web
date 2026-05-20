import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/lib/constants'
import { getStoredToken } from '@/services/api/client'
import { useAuthStore } from '@/stores/auth.store'

export function AuthGuard() {
  const location = useLocation()
  const { isAuthenticated, isHydrated } = useAuthStore()
  const hasToken = !!getStoredToken()

  if (!isHydrated) {
    return <LoadingSpinner fullScreen label="Inicializando..." />
  }

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  return <Outlet />
}
