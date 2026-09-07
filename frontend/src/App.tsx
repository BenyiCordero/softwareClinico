import type { JSX } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CitasPage from '@/pages/citas/CitasPage'
import ExpedientesPage from '@/pages/expedientes/ExpedientesPage'
import PacientesPage from '@/pages/pacientes/PacientesPage'
import MedicosPage from '@/pages/medicos/MedicosPage'
import NuevaConsultaPage from '@/pages/consultas/NuevaConsultaPage'
import HistorialConsultasPage from '@/pages/consultas/HistorialConsultasPage'
import RecetasPage from '@/pages/recetas/RecetasPage'
import LaboratorioPage from '@/pages/laboratorio/LaboratorioPage'
import CatalogoMedicamentosPage from '@/pages/farmacia/CatalogoMedicamentosPage'
import MovimientosFarmaciaPage from '@/pages/farmacia/MovimientosFarmaciaPage'
import FacturacionPage from '@/pages/facturacion/FacturacionPage'
import ActividadPage from '@/pages/actividad/ActividadPage'
import ConfiguracionPage from '@/pages/configuracion/ConfiguracionPage'
import { useAuthStore } from '@/stores/authStore'
import { Toaster } from '@/components/ui'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="expedientes" element={<ExpedientesPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="medicos" element={<MedicosPage />} />
          <Route path="consultas/nueva" element={<NuevaConsultaPage />} />
          <Route path="consultas/historial" element={<HistorialConsultasPage />} />
          <Route path="recetas" element={<RecetasPage />} />
          <Route path="laboratorio" element={<LaboratorioPage />} />
          <Route path="farmacia/catalogo" element={<CatalogoMedicamentosPage />} />
          <Route path="farmacia/movimientos" element={<MovimientosFarmaciaPage />} />
          <Route path="facturacion" element={<FacturacionPage />} />
          <Route path="actividad" element={<ActividadPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
