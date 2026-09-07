import { useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarConfig, type SidebarItem } from '@/config/sidebar'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [userExpanded, setUserExpanded] = useState<string[]>([])

  const isAutoOpen = (item: SidebarItem): boolean =>
    !!item.items?.some((sub) => sub.path === pathname)

  const isOpen = (item: SidebarItem) => isAutoOpen(item) || userExpanded.includes(item.label)

  const toggle = (label: string) => {
    setUserExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
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
            <i className="fas fa-heartbeat" />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-title">Quirurgia</div>
            <small className="sidebar-sub">Panel</small>
          </div>
        </div>

        <nav className="sidebar-nav" id="sidebar-nav">
          <ul className="sidebar-menu">
            {sidebarConfig.map((item) =>
              item.items && item.items.length ? (
                <li key={item.label}>
                  <a
                    href="#"
                    className={`sidebar-item sidebar-sub-toggle ${isOpen(item) ? 'open' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggle(item.label)
                    }}
                  >
                    <i className="fas fa-chevron-right sidebar-item-arrow" />
                    <i className={`fas ${item.fa} sidebar-item-icon`} />
                    <span>{item.label}</span>
                  </a>
                  <ul className={`sidebar-submenu ${isOpen(item) ? 'open' : ''}`}>
                    {item.items.map((sub) => (
                      <li key={sub.path}>
                        <a
                          href="#"
                          className={`sidebar-item sidebar-sub-item ${sub.path === pathname ? 'active' : ''}`}
                          onClick={go(sub)}
                        >
                          <i className={`fas ${sub.fa} sidebar-item-icon`} />
                          <span>{sub.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.path}>
                  <a
                    href="#"
                    className={`sidebar-item ${item.path === pathname ? 'active' : ''}`}
                    onClick={go(item)}
                  >
                    <i className={`fas ${item.fa} sidebar-item-icon`} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <small className="text-muted">v1.0.0</small>
        </div>
      </aside>

      {open && <div className="sidebar-overlay active" onClick={onClose} />}
    </>
  )
}