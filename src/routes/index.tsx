import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ROUTES } from '@/lib/constants'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AuthGuard } from '@/routes/guards/AuthGuard'
import { GuestGuard } from '@/routes/guards/GuestGuard'
import { PermissionGuard } from '@/routes/guards/PermissionGuard'

const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const ForgotPasswordPage = lazy(() =>
  import('@/modules/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/modules/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const DashboardPage = lazy(() =>
  import('@/modules/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const SalesListPage = lazy(() =>
  import('@/modules/sales/pages/SalesListPage').then((m) => ({ default: m.SalesListPage })),
)
const ProductsListPage = lazy(() =>
  import('@/modules/products/pages/ProductsListPage').then((m) => ({ default: m.ProductsListPage })),
)
const SettingsPage = lazy(() =>
  import('@/modules/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const SessionsPage = lazy(() =>
  import('@/modules/settings/pages/SessionsPage').then((m) => ({ default: m.SessionsPage })),
)
const ConsignmentsListPage = lazy(() =>
  import('@/modules/consignments/pages/ConsignmentsListPage').then((m) => ({
    default: m.ConsignmentsListPage,
  })),
)
const ResellersListPage = lazy(() =>
  import('@/modules/resellers/pages/ResellersListPage').then((m) => ({ default: m.ResellersListPage })),
)
const CommissionsListPage = lazy(() =>
  import('@/modules/commissions/pages/CommissionsListPage').then((m) => ({
    default: m.CommissionsListPage,
  })),
)
const PlaceholderPage = lazy(() =>
  import('@/modules/shared/pages/PlaceholderPage').then((m) => ({ default: m.PlaceholderPage })),
)

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <Lazy><LoginPage /></Lazy> },
          { path: ROUTES.forgotPassword, element: <Lazy><ForgotPasswordPage /></Lazy> },
          { path: ROUTES.resetPassword, element: <Lazy><ResetPasswordPage /></Lazy> },
        ],
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Lazy><DashboardPage /></Lazy> },
          {
            element: <PermissionGuard permission="sales.view" />,
            children: [{ path: ROUTES.sales, element: <Lazy><SalesListPage /></Lazy> }],
          },
          {
            element: <PermissionGuard permission="products.view" />,
            children: [{ path: ROUTES.products, element: <Lazy><ProductsListPage /></Lazy> }],
          },
          {
            element: <PermissionGuard permissions={['consignment.view', 'consignment.manage']} />,
            children: [
              { path: ROUTES.consignments, element: <Lazy><ConsignmentsListPage /></Lazy> },
            ],
          },
          {
            path: ROUTES.customers,
            element: <Lazy><PlaceholderPage title="Clientes" /></Lazy>,
          },
          {
            element: <PermissionGuard permission="resellers.manage" />,
            children: [{ path: ROUTES.resellers, element: <Lazy><ResellersListPage /></Lazy> }],
          },
          {
            element: <PermissionGuard permission="commissions.manage" />,
            children: [{ path: ROUTES.commissions, element: <Lazy><CommissionsListPage /></Lazy> }],
          },
          {
            path: ROUTES.financial,
            element: <Lazy><PlaceholderPage title="Financeiro" /></Lazy>,
          },
          { path: ROUTES.settings, element: <Lazy><SettingsPage /></Lazy> },
          { path: ROUTES.sessions, element: <Lazy><SessionsPage /></Lazy> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.dashboard} replace /> },
])
