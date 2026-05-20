import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGuardProps {
  permission?: string
  role?: string
}

export function PermissionGuard({ permission, role }: PermissionGuardProps) {
  const { hasPermission, hasRole, isMaster } = usePermissions()

  const allowed =
    isMaster ||
    (permission ? hasPermission(permission) : true) &&
    (role ? hasRole(role) : true)

  if (!allowed) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
