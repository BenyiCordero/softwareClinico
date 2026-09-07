import {
  ArrowLeftRight,
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
  items?: SidebarItem[]
}

export const sidebarConfig: SidebarItem[] = [
  { id: 'dashboard', label: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Citas', path: '/dashboard/appointments', icon: CalendarCheck },
  { id: 'medical-records', label: 'Expedientes', path: '/dashboard/records', icon: FolderOpen },
  { id: 'patients', label: 'Pacientes', path: '/dashboard/patients', icon: Users },
  { id: 'doctors', label: 'Médicos', path: '/dashboard/doctors', icon: BriefcaseMedical },
  {
    id: 'visits',
    label: 'Consultas',
    icon: Stethoscope,
    items: [
      { id: 'new-visit', label: 'Nueva Consulta', path: '/dashboard/visits/new', icon: ClipboardCheck },
      { id: 'visit-history', label: 'Historial', path: '/dashboard/visits/history', icon: History },
    ],
  },
  { id: 'prescriptions', label: 'Recetas', path: '/dashboard/prescriptions', icon: Syringe },
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
  { id: 'billing', label: 'Facturación', path: '/dashboard/billing', icon: Receipt },
  { id: 'activity', label: 'Actividad', path: '/dashboard/activity', icon: ChartLine },
  { id: 'settings', label: 'Configuración', path: '/dashboard/settings', icon: Settings },
]
