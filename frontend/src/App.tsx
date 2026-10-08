import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { BranchProvider } from '@/app/providers/BranchProvider'
import QueryProvider from '@/app/providers/QueryProvider'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <BranchProvider>
            <Toaster />
            <AppRoutes />
          </BranchProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}
