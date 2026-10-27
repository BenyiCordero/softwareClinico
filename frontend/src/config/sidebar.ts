import {
  Activity,
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  DollarSign,
  FolderOpen,
  LayoutDashboard,
  Receipt,
  Settings,
  Stethoscope,
  Syringe,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  path?: string
  icon: LucideIcon
  permissions?: string[]
  permissionMode?: 'all' | 'any'
  items?: SidebarItem[]
}

export interface SidebarGroup extends Omit<SidebarItem, 'path' | 'items'> {
  items: SidebarItem[]
}

const group = (id: string, label: string, icon: LucideIcon, items: SidebarItem[]): SidebarGroup => ({ id, label, icon, items })

// Top-level entries are intentionally restricted to dropdown groups.
export const sidebarConfig: SidebarGroup[] = [
  group('home', 'Inicio', LayoutDashboard, [
    { id: 'dashboard', label: 'Panel principal', path: '/dashboard', icon: LayoutDashboard },
  ]),
  group('clinical-care', 'Atención clínica', Stethoscope, [
    group('agenda', 'Agenda', CalendarCheck, [
      { id: 'appointments', label: 'Citas', path: '/dashboard/appointments', icon: CalendarCheck, permissions: ['appointments.read'] },
      { id: 'schedules', label: 'Agendas', path: '/dashboard/schedules', icon: CalendarCheck, permissions: ['schedules.read'] },
      { id: 'availability', label: 'Disponibilidad', path: '/dashboard/availability', icon: CalendarCheck, permissions: ['schedules.read'] },
    ]),
    group('patient-records', 'Pacientes y expedientes', Users, [
      { id: 'patients', label: 'Pacientes', path: '/dashboard/patients', icon: Users, permissions: ['patients.read'] },
      { id: 'medical-records', label: 'Expedientes', path: '/dashboard/records', icon: FolderOpen, permissions: ['clinical-records.read'] },
    ]),
    group('consultations', 'Consultas', BookOpen, [
      { id: 'clinical-consultations', label: 'Consultas clínicas', path: '/dashboard/consultations', icon: Stethoscope, permissions: ['consultations.read'] },
      { id: 'prescriptions', label: 'Recetas', path: '/dashboard/prescriptions', icon: Syringe, permissions: ['prescriptions.read'] },
    ]),
  ]),
  group('staff-services', 'Personal y servicios', Users, [
    { id: 'employees', label: 'Empleados', path: '/dashboard/employees', icon: Users, permissions: ['employees.read'] },
    { id: 'health-professionals', label: 'Profesionales de salud', path: '/dashboard/health-professionals', icon: Stethoscope, permissions: ['health-professionals.read'] },
    { id: 'specialties', label: 'Especialidades', path: '/dashboard/specialties', icon: Stethoscope, permissions: ['specialties.read'] },
    { id: 'positions', label: 'Puestos', path: '/dashboard/positions', icon: ClipboardCheck, permissions: ['positions.read'] },
    { id: 'services', label: 'Servicios', path: '/dashboard/services', icon: ClipboardCheck, permissions: ['services.read'] },
    { id: 'service-categories', label: 'Categorías de servicios', path: '/dashboard/service-categories', icon: ClipboardCheck, permissions: ['service-categories.read'] },
  ]),
  group('organization', 'Organización', Building2, [
    { id: 'branches', label: 'Sucursales', path: '/dashboard/branches', icon: Building2, permissions: ['branches.read'] },
    { id: 'people', label: 'Personas', path: '/dashboard/people', icon: Users, permissions: ['people.read'] },
    { id: 'areas', label: 'Áreas', path: '/dashboard/areas', icon: Building2, permissions: ['areas.read'] },
    { id: 'consulting-rooms', label: 'Consultorios', path: '/dashboard/consulting-rooms', icon: Building2, permissions: ['consulting-rooms.read'] },
    { id: 'patient-categories', label: 'Categorías de pacientes', path: '/dashboard/patient-categories', icon: Users, permissions: ['patient-categories.read'] },
  ]),
  group('billing-pricing', 'Precios y facturación', DollarSign, [
    { id: 'price-lists', label: 'Listas de precios', path: '/dashboard/price-lists', icon: Receipt, permissions: ['price-lists.read'] },
    { id: 'special-prices', label: 'Precios especiales', path: '/dashboard/special-prices', icon: Receipt, permissions: ['patient-special-prices.read'] },
    { id: 'billing', label: 'Facturación', path: '/dashboard/billing', icon: Receipt, permissions: ['orders.read', 'payments.read'], permissionMode: 'any' },
    { id: 'payment-methods', label: 'Métodos de pago', path: '/dashboard/payment-methods', icon: Receipt, permissions: ['payment-methods.read'] },
  ]),
  group('administration', 'Administración', Settings, [
    { id: 'settings', label: 'Configuración', path: '/dashboard/settings', icon: Settings },
  ]),
  group('audit', 'Auditoría', Activity, [
    { id: 'activity', label: 'Actividad', path: '/dashboard/activity', icon: Activity, permissions: ['audit-logs.read'] },
  ]),
]
