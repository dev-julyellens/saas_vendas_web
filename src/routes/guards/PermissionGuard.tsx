import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGuardProps {
  permission?: string
  permissions?: string[]
  role?: string
}

export function PermissionGuard({ permission, permissions, role }: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasRole, isMaster } = usePermissions()

  const permissionOk =
    !permission && !permissions?.length
      ? true
      : permissions?.length
        ? hasAnyPermission(...permissions)
        : hasPermission(permission!)

  const allowed = isMaster || (permissionOk && (role ? hasRole(role) : true))

  if (!allowed) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
