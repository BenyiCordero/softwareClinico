import { useState, type MouseEvent } from 'react'
import { ChevronRight, HeartPulse } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarConfig, type SidebarItem } from '@/config/sidebar'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [openOverride, setOpenOverride] = useState<Record<string, boolean>>({})

  // On navigation, drop manual overrides so auto-open applies again.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setOpenOverride({})
  }

  // Manual toggle wins; otherwise the section holding the current route opens.
  const isAutoOpen = (item: SidebarItem): boolean =>
    !!item.items?.some((sub) => sub.path === pathname)

  const isOpen = (item: SidebarItem) => openOverride[item.id] ?? isAutoOpen(item)

  const toggle = (item: SidebarItem) => {
    const next = !(openOverride[item.id] ?? isAutoOpen(item))
    setOpenOverride((prev) => ({ ...prev, [item.id]: next }))
  }

  const go = (item: SidebarItem) => (e: MouseEvent) => {
    e.preventDefault()
    if (item.path) {
      navigate(item.path)
      onClose()
    }
  }

  return (
    <>
      <aside id="sidebar" className={open ? 'sidebar-open' : ''}>
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <HeartPulse className="h-7 w-7" />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-title">Quirurgia</div>
            <small className="sidebar-sub">Panel</small>
          </div>
        </div>

        <nav className="sidebar-nav" id="sidebar-nav">
          <ul className="sidebar-menu">
            {sidebarConfig.map((item) => {
              const ItemIcon = item.icon
              return item.items && item.items.length ? (
                <li key={item.id}>
                  <a
                    href="#"
                    className={`sidebar-item sidebar-sub-toggle ${isOpen(item) ? 'open' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggle(item)
                    }}
                    aria-expanded={isOpen(item)}
                  >
                    <ChevronRight className="sidebar-item-arrow" />
                    <ItemIcon className="sidebar-item-icon h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                  <ul className={`sidebar-submenu ${isOpen(item) ? 'open' : ''}`}>
                    {item.items.map((sub) => {
                      const SubIcon = sub.icon
                      return (
                        <li key={sub.path}>
                          <a
                            href="#"
                            className={`sidebar-item sidebar-sub-item ${sub.path === pathname ? 'active' : ''}`}
                            onClick={go(sub)}
                          >
                            <SubIcon className="sidebar-item-icon h-4 w-4" />
                            <span>{sub.label}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ) : (
                <li key={item.path}>
                  <a
                    href="#"
                    className={`sidebar-item ${item.path === pathname ? 'active' : ''}`}
                    onClick={go(item)}
                  >
                    <ItemIcon className="sidebar-item-icon h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <small className="text-ink-muted">v1.0.0</small>
        </div>
      </aside>

      {open && <div className="sidebar-overlay active" onClick={onClose} />}
    </>
  )
}