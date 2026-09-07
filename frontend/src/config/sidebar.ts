export interface SidebarItem {
  id: string
  label: string
  path?: string
  fa: string
  items?: SidebarItem[]
}

export const sidebarConfig: SidebarItem[] = [
  { id: 'dashboard', label: 'Panel Principal', path: '/dashboard', fa: 'fa-tachometer-alt' },
  { id: 'appointments', label: 'Citas', path: '/dashboard/appointments', fa: 'fa-calendar-check' },
  { id: 'medical-records', label: 'Expedientes', path: '/dashboard/records', fa: 'fa-folder-open' },
  { id: 'patients', label: 'Pacientes', path: '/dashboard/patients', fa: 'fa-user-injured' },
  { id: 'doctors', label: 'Médicos', path: '/dashboard/doctors', fa: 'fa-user-md' },
  {
    id: 'visits',
    label: 'Consultas',
    fa: 'fa-stethoscope',
    items: [
      { id: 'new-visit', label: 'Nueva Consulta', path: '/dashboard/visits/new', fa: 'fa-clipboard-check' },
      { id: 'visit-history', label: 'Historial', path: '/dashboard/visits/history', fa: 'fa-history' },
    ],
  },
  { id: 'prescriptions', label: 'Recetas', path: '/dashboard/prescriptions', fa: 'fa-prescription-bottle' },
  { id: 'lab', label: 'Laboratorio', path: '/dashboard/lab', fa: 'fa-flask' },
  {
    id: 'pharmacy',
    label: 'Farmacia',
    fa: 'fa-pills',
    items: [
      { id: 'medication-catalog', label: 'Catálogo de Medicamentos', path: '/dashboard/pharmacy/catalog', fa: 'fa-capsules' },
      { id: 'pharmacy-movements', label: 'Movimientos', path: '/dashboard/pharmacy/movements', fa: 'fa-exchange-alt' },
    ],
  },
  { id: 'billing', label: 'Facturación', path: '/dashboard/billing', fa: 'fa-file-invoice-dollar' },
  { id: 'activity', label: 'Actividad', path: '/dashboard/activity', fa: 'fa-chart-line' },
  { id: 'settings', label: 'Configuración', path: '/dashboard/settings', fa: 'fa-cog' },
]