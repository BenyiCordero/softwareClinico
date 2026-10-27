import { lazy, type ComponentType, type ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import PermissionGuard from '@/routes/PermissionGuard'
const page = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader)
const named = <T extends Record<string, ComponentType>>(loader: () => Promise<T>, key: keyof T) => lazy(() => loader().then((module) => ({ default: module[key] })))
  const AppointmentsPage = page(() => import('@/pages/agenda/AppointmentsPage')); const SchedulesPage = page(() => import('@/pages/agenda/SchedulesPage')); const AvailabilityPage = page(() => import('@/pages/agenda/AvailabilityPage')); const MedicalRecordsPage = page(() => import('@/pages/records/MedicalRecordsPage')); const PatientsPage = page(() => import('@/pages/patients/PatientsPage')); const DoctorsPage = page(() => import('@/pages/doctors/DoctorsPage')); const NewVisitPage = page(() => import('@/pages/visits/NewVisitPage')); const VisitHistoryPage = page(() => import('@/pages/visits/VisitHistoryPage')); const PrescriptionsPage = page(() => import('@/pages/prescriptions/PrescriptionsPage')); const BillingPage = page(() => import('@/pages/billing/BillingPage')); const ActivityPage = page(() => import('@/pages/activity/ActivityPage')); const SettingsPage = page(() => import('@/pages/settings/SettingsPage')); const DashboardPage = page(() => import('@/pages/DashboardPage')); const BranchesPage = page(() => import('@/pages/branches/BranchesPage')); const PriceListDetailsPage = page(() => import('@/pages/pricing/PriceListDetailsPage')); const PatientDetailPage = page(() => import('@/pages/patients/PatientDetailPage')); const ConsultationDetailPage = page(() => import('@/pages/clinical/ConsultationDetailPage')); const PrescriptionItemsPage = page(() => import('@/pages/prescriptions/PrescriptionItemsPage')); const OrderDetailPage = page(() => import('@/pages/billing/OrderDetailPage')); const NotFoundPage = page(() => import('@/pages/NotFoundPage'))
const AreasPage = named(() => import('@/pages/catalogs/CatalogPages'), 'AreasPage'); const ConsultingRoomsPage = named(() => import('@/pages/catalogs/CatalogPages'), 'ConsultingRoomsPage'); const PatientCategoriesPage = named(() => import('@/pages/catalogs/CatalogPages'), 'PatientCategoriesPage'); const PaymentMethodsPage = named(() => import('@/pages/catalogs/CatalogPages'), 'PaymentMethodsPage'); const PeoplePage = named(() => import('@/pages/catalogs/CatalogPages'), 'PeoplePage'); const PositionsPage = named(() => import('@/pages/catalogs/CatalogPages'), 'PositionsPage'); const SpecialtiesPage = named(() => import('@/pages/catalogs/CatalogPages'), 'SpecialtiesPage'); const EmployeesPage = named(() => import('@/pages/staff/StaffPages'), 'EmployeesPage'); const HealthProfessionalsPage = named(() => import('@/pages/staff/StaffPages'), 'HealthProfessionalsPage'); const ServiceCategoriesPage = named(() => import('@/pages/staff/StaffPages'), 'ServiceCategoriesPage'); const ServicesPage = named(() => import('@/pages/staff/StaffPages'), 'ServicesPage'); const EmployeeAssignmentsPage = named(() => import('@/pages/staff/StaffRelationsPage'), 'EmployeeAssignmentsPage'); const ProfessionalSpecialtiesPage = named(() => import('@/pages/staff/StaffRelationsPage'), 'ProfessionalSpecialtiesPage'); const ServiceRelationshipsPage = named(() => import('@/pages/staff/StaffRelationsPage'), 'ServiceRelationshipsPage'); const PriceListsPage = named(() => import('@/pages/pricing/PricingPages'), 'PriceListsPage'); const SpecialPricesPage = named(() => import('@/pages/pricing/PricingPages'), 'SpecialPricesPage'); const ConsultationsPage = page(() => import('@/pages/clinical/ConsultationsPage'))
const guarded = (permission: string | string[], element: ReactNode, mode: 'all' | 'any' = 'all') => <PermissionGuard permission={permission} mode={mode}>{element}</PermissionGuard>

/** Canonical English dashboard routes. */
export const dashboardChildren: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'appointments', element: guarded('appointments.read', <AppointmentsPage />) },
  { path: 'schedules', element: guarded('schedules.read', <SchedulesPage />) },
  { path: 'availability', element: guarded('schedules.read', <AvailabilityPage />) },
  { path: 'records', element: guarded('clinical-records.read', <MedicalRecordsPage />) },
  { path: 'patients', element: guarded('patients.read', <PatientsPage />) },
  { path: 'doctors', element: guarded('health-professionals.read', <DoctorsPage />) },
  { path: 'visits/new', element: guarded('consultations.create', <NewVisitPage />) },
  { path: 'visits/history', element: guarded('consultations.read', <VisitHistoryPage />) },
  { path: 'prescriptions', element: guarded('prescriptions.read', <PrescriptionsPage />) },
  { path: 'billing', element: guarded(['orders.read', 'payments.read'], <BillingPage />, 'any') },
  { path: 'activity', element: guarded('audit-logs.read', <ActivityPage />) },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'branches', element: guarded('branches.read', <BranchesPage />) },
  { path: 'people', element: guarded('people.read', <PeoplePage />) },
  { path: 'areas', element: guarded('areas.read', <AreasPage />) },
  { path: 'consulting-rooms', element: guarded('consulting-rooms.read', <ConsultingRoomsPage />) },
  { path: 'positions', element: guarded('positions.read', <PositionsPage />) },
  { path: 'specialties', element: guarded('specialties.read', <SpecialtiesPage />) },
  { path: 'patient-categories', element: guarded('patient-categories.read', <PatientCategoriesPage />) },
  { path: 'payment-methods', element: guarded('payment-methods.read', <PaymentMethodsPage />) },
  { path: 'employees', element: guarded('employees.read', <EmployeesPage />) },
  { path: 'health-professionals', element: guarded('health-professionals.read', <HealthProfessionalsPage />) },
  { path: 'services', element: guarded('services.read', <ServicesPage />) },
  { path: 'service-categories', element: guarded('service-categories.read', <ServiceCategoriesPage />) },
  { path: 'employees/:id/assignments', element: guarded('employees.read', <EmployeeAssignmentsPage />) },
  { path: 'health-professionals/:id/specialties', element: guarded('health-professionals.read', <ProfessionalSpecialtiesPage />) },
  { path: 'services/:id/relationships', element: guarded('services.read', <ServiceRelationshipsPage />) },
  { path: 'price-lists', element: guarded('price-lists.read', <PriceListsPage />) },
  { path: 'price-lists/:id/details', element: guarded('price-lists.read', <PriceListDetailsPage />) },
  { path: 'special-prices', element: guarded('patient-special-prices.read', <SpecialPricesPage />) },
  { path: 'patients/:id', element: guarded('patients.read', <PatientDetailPage />) },
  { path: 'consultations', element: guarded('consultations.read', <ConsultationsPage />) },
  { path: 'consultations/:id', element: guarded('consultations.read', <ConsultationDetailPage />) },
  { path: 'prescriptions/:id/items', element: guarded('prescriptions.read', <PrescriptionItemsPage />) },
  { path: 'billing/:id', element: guarded(['orders.read', 'payments.read'], <OrderDetailPage />, 'any') },
  { path: '*', element: <NotFoundPage /> },
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
  { from: 'facturacion', to: '/dashboard/billing' },
  { from: 'actividad', to: '/dashboard/activity' },
  { from: 'configuracion', to: '/dashboard/settings' },
]

export const dashboardLegacyRedirects: RouteObject[] = legacyRedirects.map(({ from, to }) => ({
  path: from,
  element: <Navigate to={to} replace />,
}))
