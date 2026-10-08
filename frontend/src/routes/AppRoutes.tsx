import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import { dashboardChildren, dashboardLegacyRedirects } from './dashboard.routes'
import { ProtectedRoute, PublicOnlyRoute } from './guards'

const routes: RouteObject[] = [
  { path: '/login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
  { path: '/dashboard', element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>, children: [...dashboardChildren, ...dashboardLegacyRedirects] },
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]

export default function AppRoutes() {
  return useRoutes(routes)
}
