import { Navigate, type RouteObject } from 'react-router-dom'
import AppointmentsPage from '@/pages/agenda/AppointmentsPage'
import SchedulesPage from '@/pages/agenda/SchedulesPage'
import AvailabilityPage from '@/pages/agenda/AvailabilityPage'
import MedicalRecordsPage from '@/pages/expedientes/ExpedientesPage'
import PatientsPage from '@/pages/pacientes/PacientesPage'
import DoctorsPage from '@/pages/medicos/MedicosPage'
import NewVisitPage from '@/pages/consultas/NuevaConsultaPage'
import VisitHistoryPage from '@/pages/consultas/HistorialConsultasPage'
import PrescriptionsPage from '@/pages/recetas/RecetasPage'
import LabPage from '@/pages/laboratorio/LaboratorioPage'
import MedicationCatalogPage from '@/pages/farmacia/CatalogoMedicamentosPage'
import PharmacyMovementsPage from '@/pages/farmacia/MovimientosFarmaciaPage'
import BillingPage from '@/pages/facturacion/FacturacionPage'
import ActivityPage from '@/pages/actividad/ActividadPage'
import SettingsPage from '@/pages/configuracion/ConfiguracionPage'
import DashboardPage from '@/pages/DashboardPage'
import BranchesPage from '@/pages/branches/BranchesPage'
import { AreasPage, ConsultingRoomsPage, PatientCategoriesPage, PaymentMethodsPage, PeoplePage, PositionsPage, SpecialtiesPage } from '@/pages/catalogs/CatalogPages'
import { EmployeesPage, HealthProfessionalsPage, ServiceCategoriesPage, ServicesPage } from '@/pages/staff/StaffPages'
import { EmployeeAssignmentsPage, ProfessionalSpecialtiesPage, ServiceRelationshipsPage } from '@/pages/staff/StaffRelationsPage'
import { PriceListsPage, SpecialPricesPage } from '@/pages/pricing/PricingPages'
import PriceListDetailsPage from '@/pages/pricing/PriceListDetailsPage'
import PatientDetailPage from '@/pages/pacientes/PatientDetailPage'

/** Canonical English dashboard routes. */
export const dashboardChildren: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'appointments', element: <AppointmentsPage /> },
  { path: 'schedules', element: <SchedulesPage /> },
  { path: 'availability', element: <AvailabilityPage /> },
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
  { path: 'branches', element: <BranchesPage /> },
  { path: 'people', element: <PeoplePage /> },
  { path: 'areas', element: <AreasPage /> },
  { path: 'consulting-rooms', element: <ConsultingRoomsPage /> },
  { path: 'positions', element: <PositionsPage /> },
  { path: 'specialties', element: <SpecialtiesPage /> },
  { path: 'patient-categories', element: <PatientCategoriesPage /> },
  { path: 'payment-methods', element: <PaymentMethodsPage /> },
  { path: 'employees', element: <EmployeesPage /> },
  { path: 'health-professionals', element: <HealthProfessionalsPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'service-categories', element: <ServiceCategoriesPage /> },
  { path: 'employees/:id/assignments', element: <EmployeeAssignmentsPage /> },
  { path: 'health-professionals/:id/specialties', element: <ProfessionalSpecialtiesPage /> },
  { path: 'services/:id/relationships', element: <ServiceRelationshipsPage /> },
  { path: 'price-lists', element: <PriceListsPage /> },
  { path: 'price-lists/:id/details', element: <PriceListDetailsPage /> },
  { path: 'special-prices', element: <SpecialPricesPage /> },
  { path: 'patients/:id', element: <PatientDetailPage /> },
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
