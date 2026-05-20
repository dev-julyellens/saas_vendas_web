import { useAuthStore } from '@/stores/auth.store'

export function usePermissions() {
  const user = useAuthStore((s) => s.user)

  const permissions = user?.permissions ?? []
  const roles = user?.roles?.map((r) => r.slug) ?? []
  const isMaster = user?.is_master ?? false

  const hasPermission = (permission: string) =>
    isMaster || permissions.includes(permission)

  const hasRole = (role: string) => isMaster || roles.includes(role)

  const hasAnyPermission = (...perms: string[]) =>
    isMaster || perms.some((p) => permissions.includes(p))

  return { permissions, roles, isMaster, hasPermission, hasRole, hasAnyPermission }
}
