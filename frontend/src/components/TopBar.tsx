import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface TopBarProps {
  onToggleSidebar: () => void
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const navigate = useNavigate()
  const displayName = useAuthStore((s) => s.displayName)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initial = (displayName ?? 'U').charAt(0).toUpperCase()

  return (
    <header id="topbar">
      <div className="topbar-left">
        <button
          className="btn btn-link topbar-toggle d-lg-none"
          id="sidebarToggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <i className="fas fa-bars" />
        </button>
        <div className="topbar-brand-icon">
          <i className="fas fa-heartbeat icon-brand" />
        </div>
        <span className="topbar-brand">Quirurgia</span>
      </div>

      <div className="topbar-right">
        <button className="btn btn-topbar-icon" id="btn-reload" type="button" title="Recargar módulo actual">
          <i className="fas fa-sync-alt" />
        </button>
        <div className="topbar-user-info">
          <span className="topbar-greeting">Bienvenido,</span>
          <span className="topbar-user fw-semibold" id="display-name">
            {displayName ?? 'Usuario'}
          </span>
        </div>
        <div className="topbar-avatar">{initial}</div>
        <button className="btn btn-topbar-logout" id="btn-logout" type="button" title="Cerrar sesión" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </header>
  )
}