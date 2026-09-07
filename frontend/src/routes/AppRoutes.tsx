import { Navigate, useRoutes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import { ProtectedRoute, PublicOnlyRoute } from './guards'
import { dashboardChildren, dashboardLegacyRedirects } from './dashboard.routes'

export default function AppRoutes() {
  return useRoutes([
    {
      path: '/login',
      element: (
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [...dashboardChildren, ...dashboardLegacyRedirects],
    },
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '*', element: <Navigate to="/login" replace /> },
  ])
}
