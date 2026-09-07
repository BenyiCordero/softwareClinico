import type { JSX } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AppointmentsPage from '@/pages/appointments/AppointmentsPage'
import MedicalRecordsPage from '@/pages/records/MedicalRecordsPage'
import PatientsPage from '@/pages/patients/PatientsPage'
import DoctorsPage from '@/pages/doctors/DoctorsPage'
import NewVisitPage from '@/pages/visits/NewVisitPage'
import VisitHistoryPage from '@/pages/visits/VisitHistoryPage'
import PrescriptionsPage from '@/pages/prescriptions/PrescriptionsPage'
import LabPage from '@/pages/lab/LabPage'
import MedicationCatalogPage from '@/pages/pharmacy/MedicationCatalogPage'
import PharmacyMovementsPage from '@/pages/pharmacy/PharmacyMovementsPage'
import BillingPage from '@/pages/billing/BillingPage'
import ActivityPage from '@/pages/activity/ActivityPage'
import SettingsPage from '@/pages/settings/SettingsPage'
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
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="records" element={<MedicalRecordsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="visits/new" element={<NewVisitPage />} />
          <Route path="visits/history" element={<VisitHistoryPage />} />
          <Route path="prescriptions" element={<PrescriptionsPage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="pharmacy/catalog" element={<MedicationCatalogPage />} />
          <Route path="pharmacy/movements" element={<PharmacyMovementsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Legacy Spanish URLs → English canonical routes */}
          <Route path="citas" element={<Navigate to="/dashboard/appointments" replace />} />
          <Route path="expedientes" element={<Navigate to="/dashboard/records" replace />} />
          <Route path="pacientes" element={<Navigate to="/dashboard/patients" replace />} />
          <Route path="medicos" element={<Navigate to="/dashboard/doctors" replace />} />
          <Route path="consultas/nueva" element={<Navigate to="/dashboard/visits/new" replace />} />
          <Route path="consultas/historial" element={<Navigate to="/dashboard/visits/history" replace />} />
          <Route path="recetas" element={<Navigate to="/dashboard/prescriptions" replace />} />
          <Route path="laboratorio" element={<Navigate to="/dashboard/lab" replace />} />
          <Route path="farmacia/catalogo" element={<Navigate to="/dashboard/pharmacy/catalog" replace />} />
          <Route path="farmacia/movimientos" element={<Navigate to="/dashboard/pharmacy/movements" replace />} />
          <Route path="facturacion" element={<Navigate to="/dashboard/billing" replace />} />
          <Route path="actividad" element={<Navigate to="/dashboard/activity" replace />} />
          <Route path="configuracion" element={<Navigate to="/dashboard/settings" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
