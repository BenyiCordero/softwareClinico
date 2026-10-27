import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { BranchProvider } from '@/app/providers/BranchProvider'
import QueryProvider from '@/app/providers/QueryProvider'
import AppRoutes from '@/routes/AppRoutes'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <Toaster />
            <ErrorBoundary><AppRoutes /></ErrorBoundary>
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}
