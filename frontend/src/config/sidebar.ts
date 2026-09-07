export interface SidebarItem {
  label: string
  path?: string
  fa: string
  items?: SidebarItem[]
}

export const sidebarConfig: SidebarItem[] = [
  { label: 'Panel Principal', path: '/dashboard', fa: 'fa-tachometer-alt' },
  { label: 'Citas', path: '/dashboard/citas', fa: 'fa-calendar-check' },
  { label: 'Expedientes', path: '/dashboard/expedientes', fa: 'fa-folder-open' },
  { label: 'Pacientes', path: '/dashboard/pacientes', fa: 'fa-user-injured' },
  { label: 'Médicos', path: '/dashboard/medicos', fa: 'fa-user-md' },
  {
    label: 'Consultas',
    fa: 'fa-stethoscope',
    items: [
      { label: 'Nueva Consulta', path: '/dashboard/consultas/nueva', fa: 'fa-clipboard-check' },
      { label: 'Historial', path: '/dashboard/consultas/historial', fa: 'fa-history' },
    ],
  },
  { label: 'Recetas', path: '/dashboard/recetas', fa: 'fa-prescription-bottle' },
  { label: 'Laboratorio', path: '/dashboard/laboratorio', fa: 'fa-flask' },
  {
    label: 'Farmacia',
    fa: 'fa-pills',
    items: [
      { label: 'Catálogo de Medicamentos', path: '/dashboard/farmacia/catalogo', fa: 'fa-capsules' },
      { label: 'Movimientos', path: '/dashboard/farmacia/movimientos', fa: 'fa-exchange-alt' },
    ],
  },
  { label: 'Facturación', path: '/dashboard/facturacion', fa: 'fa-file-invoice-dollar' },
  { label: 'Actividad', path: '/dashboard/actividad', fa: 'fa-chart-line' },
  { label: 'Configuración', path: '/dashboard/configuracion', fa: 'fa-cog' },
]