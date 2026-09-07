import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  )
}
