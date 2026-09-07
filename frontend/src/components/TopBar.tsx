import { HeartPulse, LogOut, Menu, RotateCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button } from '@/components/ui'
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

  return (
    <header id="topbar">
      <div className="topbar-left">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          id="sidebarToggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="topbar-brand-icon">
          <HeartPulse className="icon-brand h-6 w-6" />
        </div>
        <span className="topbar-brand">Quirurgia</span>
      </div>

      <div className="topbar-right">
        <Button
          variant="outline"
          size="icon"
          id="btn-reload"
          type="button"
          title="Recargar módulo actual"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <div className="topbar-user-info">
          <span className="topbar-greeting">Bienvenido,</span>
          <span className="topbar-user font-semibold" id="display-name">
            {displayName ?? 'Usuario'}
          </span>
        </div>
        <Avatar name={displayName ?? 'Usuario'} />
        <Button
          variant="outline"
          size="icon"
          id="btn-logout"
          type="button"
          title="Cerrar sesión"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}