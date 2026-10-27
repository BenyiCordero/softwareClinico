import { useState, type MouseEvent, type ReactNode } from 'react'
import { ChevronRight, HeartPulse } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBranch } from '@/app/providers/branch-context'
import { sidebarConfig, type SidebarItem } from '@/config/sidebar'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [manualOpen, setManualOpen] = useState<{ pathname: string; id: string | null } | null>(null)
  const { can, permissionsLoading } = useBranch()

  const containsPath = (item: SidebarItem): boolean =>
    item.path === pathname || Boolean(item.items?.some(containsPath))

  const containsId = (item: SidebarItem, id: string): boolean =>
    item.id === id || Boolean(item.items?.some((child) => containsId(child, id)))

  const isOpen = (item: SidebarItem): boolean =>
    manualOpen?.pathname === pathname
      ? containsId(item, manualOpen.id ?? '')
      : containsPath(item)

  const toggle = (item: SidebarItem) => {
    setManualOpen({ pathname, id: isOpen(item) ? null : item.id })
  }

  const go = (item: SidebarItem) => (event: MouseEvent) => {
    event.preventDefault()
    if (item.path) {
      navigate(item.path)
      onClose()
    }
  }

  const canRender = (item: SidebarItem): boolean => {
    const ownPermission = can(item.permissions, item.permissionMode)
    if (!item.items?.length) return ownPermission
    return ownPermission && item.items.some(canRender)
  }

  const renderItem = (item: SidebarItem, depth = 0): ReactNode => {
    const hasChildren = Boolean(item.items?.length)
    const ItemIcon = item.icon
    if (hasChildren) {
      return <li key={item.id}>
        <button type="button" className={`sidebar-item sidebar-sub-toggle ${isOpen(item) ? 'open' : ''}`} onClick={() => toggle(item)} aria-expanded={isOpen(item)} aria-controls={`sidebar-submenu-${item.id}`}>
          <ChevronRight className="sidebar-item-arrow" />
          <ItemIcon className="sidebar-item-icon h-4 w-4" />
          <span>{item.label}</span>
        </button>
        <ul id={`sidebar-submenu-${item.id}`} className={`sidebar-submenu sidebar-submenu-level-${depth + 1} ${isOpen(item) ? 'open' : ''}`}>
          {item.items?.filter(canRender).map((child) => renderItem(child, depth + 1))}
        </ul>
      </li>
    }
    return <li key={item.path ?? item.id}>
      <a href={item.path} className={`sidebar-item ${item.path === pathname ? 'active' : ''}`} onClick={go(item)} aria-current={item.path === pathname ? 'page' : undefined}>
        <ItemIcon className="sidebar-item-icon h-4 w-4" />
        <span>{item.label}</span>
      </a>
    </li>
  }

  return <>
    <aside id="sidebar" className={open ? 'sidebar-open' : ''}>
      <div className="sidebar-header">
        <div className="sidebar-brand-icon"><HeartPulse className="h-7 w-7" /></div>
        <div className="sidebar-brand-text"><div className="sidebar-title">Quirurgia</div><small className="sidebar-sub">Panel</small></div>
      </div>
      <nav className="sidebar-nav" id="sidebar-nav" aria-label="Navegación principal">
        <ul className="sidebar-menu">
          {permissionsLoading ? <li className="px-4 py-3 text-sm text-ink-muted" role="status">Cargando permisos...</li> : sidebarConfig.filter(canRender).map((item) => renderItem(item))}
        </ul>
      </nav>
      <div className="sidebar-footer"><small className="text-ink-muted">v1.0.0</small></div>
    </aside>
    {open && <div className="sidebar-overlay active" onClick={onClose} />}
  </>
}
