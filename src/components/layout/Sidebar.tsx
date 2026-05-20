import {
  Box,
  Handshake,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/usePermissions'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

const mainNav = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.sales, label: 'Vendas', icon: ShoppingCart, permission: 'sales.view' },
  { to: ROUTES.products, label: 'Produtos', icon: Package, permission: 'products.view' },
  { to: ROUTES.consignments, label: 'Consignações', icon: Handshake, permission: 'consignment.view' },
  { to: ROUTES.customers, label: 'Clientes', icon: Users, permission: 'customers.view' },
  { to: ROUTES.resellers, label: 'Revendedores', icon: Box },
  { to: ROUTES.commissions, label: 'Comissões', icon: Wallet },
]

const settingsNav = [
  { to: ROUTES.settings, label: 'Configurações', icon: Settings },
  { to: ROUTES.sessions, label: 'Sessões', icon: Users },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const { hasPermission, isMaster } = usePermissions()

  const canShow = (permission?: string) => !permission || isMaster || hasPermission(permission)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent',
    )

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div>
            <p className="font-bold text-sm leading-tight">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">Gestão de vendas</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {mainNav.filter((item) => canShow(item.permission)).map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Separator className="my-4" />

          <p className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">Conta</p>
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
