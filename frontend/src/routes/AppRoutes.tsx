import { lazy, Suspense } from 'react'
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import { dashboardChildren, dashboardLegacyRedirects } from './dashboard.routes'
import { ProtectedRoute, PublicOnlyRoute } from './guards'
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const routes: RouteObject[] = [
  { path: '/login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
  { path: '/dashboard', element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>, children: [...dashboardChildren, ...dashboardLegacyRedirects] },
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <NotFoundPage /> },
]

export default function AppRoutes() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-ink-muted" role="status">Cargando...</div>}>{useRoutes(routes)}</Suspense>
}
