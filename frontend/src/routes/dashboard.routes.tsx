import { Navigate, type RouteObject } from 'react-router-dom'
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
import DashboardPage from '@/pages/DashboardPage'

/** Canonical English dashboard routes. */
export const dashboardChildren: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'appointments', element: <AppointmentsPage /> },
  { path: 'records', element: <MedicalRecordsPage /> },
  { path: 'patients', element: <PatientsPage /> },
  { path: 'doctors', element: <DoctorsPage /> },
  { path: 'visits/new', element: <NewVisitPage /> },
  { path: 'visits/history', element: <VisitHistoryPage /> },
  { path: 'prescriptions', element: <PrescriptionsPage /> },
  { path: 'lab', element: <LabPage /> },
  { path: 'pharmacy/catalog', element: <MedicationCatalogPage /> },
  { path: 'pharmacy/movements', element: <PharmacyMovementsPage /> },
  { path: 'billing', element: <BillingPage /> },
  { path: 'activity', element: <ActivityPage /> },
  { path: 'settings', element: <SettingsPage /> },
]

/** Legacy Spanish URLs → English canonical routes (bookmarks/back-compat). */
const legacyRedirects: Array<{ from: string; to: string }> = [
  { from: 'citas', to: '/dashboard/appointments' },
  { from: 'expedientes', to: '/dashboard/records' },
  { from: 'pacientes', to: '/dashboard/patients' },
  { from: 'medicos', to: '/dashboard/doctors' },
  { from: 'consultas/nueva', to: '/dashboard/visits/new' },
  { from: 'consultas/historial', to: '/dashboard/visits/history' },
  { from: 'recetas', to: '/dashboard/prescriptions' },
  { from: 'laboratorio', to: '/dashboard/lab' },
  { from: 'farmacia/catalogo', to: '/dashboard/pharmacy/catalog' },
  { from: 'farmacia/movimientos', to: '/dashboard/pharmacy/movements' },
  { from: 'facturacion', to: '/dashboard/billing' },
  { from: 'actividad', to: '/dashboard/activity' },
  { from: 'configuracion', to: '/dashboard/settings' },
]

export const dashboardLegacyRedirects: RouteObject[] = legacyRedirects.map(({ from, to }) => ({
  path: from,
  element: <Navigate to={to} replace />,
}))
