import {
  ArrowLeftRight,
  Building2,
  BriefcaseMedical,
  CalendarCheck,
  ChartLine,
  ClipboardCheck,
  Cross,
  FolderOpen,
  History,
  LayoutDashboard,
  Microscope,
  Pill,
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

export const sidebarConfig: SidebarItem[] = [
  { id: 'dashboard', label: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Citas', path: '/dashboard/appointments', icon: CalendarCheck, permissions: ['appointments.read'] },
  { id: 'schedules', label: 'Agendas', path: '/dashboard/schedules', icon: CalendarCheck, permissions: ['schedules.read'] },
  { id: 'availability', label: 'Disponibilidad', path: '/dashboard/availability', icon: CalendarCheck, permissions: ['appointments.read'] },
  { id: 'medical-records', label: 'Expedientes', path: '/dashboard/records', icon: FolderOpen, permissions: ['clinical-records.read'] },
  { id: 'patients', label: 'Pacientes', path: '/dashboard/patients', icon: Users, permissions: ['patients.read'] },
  { id: 'doctors', label: 'Médicos', path: '/dashboard/doctors', icon: BriefcaseMedical, permissions: ['health-professionals.read'] },
  {
    id: 'visits',
    label: 'Consultas',
    icon: Stethoscope,
    items: [
      { id: 'new-visit', label: 'Nueva Consulta', path: '/dashboard/visits/new', icon: ClipboardCheck, permissions: ['consultations.create'] },
      { id: 'visit-history', label: 'Historial', path: '/dashboard/visits/history', icon: History, permissions: ['consultations.read'] },
    ],
  },
  { id: 'prescriptions', label: 'Recetas', path: '/dashboard/prescriptions', icon: Syringe, permissions: ['prescriptions.read'] },
  { id: 'lab', label: 'Laboratorio', path: '/dashboard/lab', icon: Microscope },
  {
    id: 'pharmacy',
    label: 'Farmacia',
    icon: Cross,
    items: [
      { id: 'medication-catalog', label: 'Catálogo de Medicamentos', path: '/dashboard/pharmacy/catalog', icon: Pill },
      { id: 'pharmacy-movements', label: 'Movimientos', path: '/dashboard/pharmacy/movements', icon: ArrowLeftRight },
    ],
  },
  { id: 'billing', label: 'Facturación', path: '/dashboard/billing', icon: Receipt, permissions: ['orders.read', 'payments.read'], permissionMode: 'any' },
  { id: 'activity', label: 'Actividad', path: '/dashboard/activity', icon: ChartLine, permissions: ['audit-logs.read'] },
  { id: 'branches', label: 'Sucursales', path: '/dashboard/branches', icon: Building2, permissions: ['branches.read'] },
  { id: 'people', label: 'Personas', path: '/dashboard/people', icon: Users, permissions: ['people.read'] },
  { id: 'areas', label: 'Áreas', path: '/dashboard/areas', icon: Building2, permissions: ['areas.read'] },
  { id: 'consulting-rooms', label: 'Consultorios', path: '/dashboard/consulting-rooms', icon: Building2, permissions: ['consulting-rooms.read'] },
  { id: 'positions', label: 'Puestos', path: '/dashboard/positions', icon: BriefcaseMedical, permissions: ['positions.read'] },
  { id: 'specialties', label: 'Especialidades', path: '/dashboard/specialties', icon: Stethoscope, permissions: ['specialties.read'] },
  { id: 'patient-categories', label: 'Categorías de pacientes', path: '/dashboard/patient-categories', icon: Users, permissions: ['patient-categories.read'] },
  { id: 'payment-methods', label: 'Métodos de pago', path: '/dashboard/payment-methods', icon: Receipt, permissions: ['payment-methods.read'] },
  { id: 'employees', label: 'Empleados', path: '/dashboard/employees', icon: Users, permissions: ['employees.read'] },
  { id: 'health-professionals', label: 'Profesionales de salud', path: '/dashboard/health-professionals', icon: Stethoscope, permissions: ['health-professionals.read'] },
  { id: 'services', label: 'Servicios', path: '/dashboard/services', icon: ClipboardCheck, permissions: ['services.read'] },
  { id: 'service-categories', label: 'Categorías de servicios', path: '/dashboard/service-categories', icon: ClipboardCheck, permissions: ['service-categories.read'] },
  { id: 'price-lists', label: 'Listas de precios', path: '/dashboard/price-lists', icon: Receipt, permissions: ['price-lists.read'] },
  { id: 'special-prices', label: 'Precios especiales', path: '/dashboard/special-prices', icon: Receipt, permissions: ['patient-special-prices.read'] },
  { id: 'settings', label: 'Configuración', path: '/dashboard/settings', icon: Settings, permissions: ['users.read'] },
]
