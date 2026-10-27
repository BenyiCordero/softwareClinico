import { HeartPulse, LogOut, Menu, RotateCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, Button, SearchableSelect } from '@/components/ui'
import { useAuth } from '@/app/providers/auth-context'
import { useBranch } from '@/app/providers/branch-context'

interface TopBarProps {
  onToggleSidebar: () => void
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { displayName, logout } = useAuth()
  const { branches, activeBranchId, isLoading: branchesLoading, setActiveBranchId } = useBranch()

  const handleLogout = async () => {
    await logout()
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
          aria-label="Recargar módulo actual"
          onClick={() => void queryClient.invalidateQueries()}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <div className="topbar-user-info">
          <span className="topbar-greeting">Bienvenido,</span>
          <span className="topbar-user font-semibold" id="display-name">
            {displayName ?? 'Usuario'}
          </span>
        </div>
        {branches.length > 0 && <div className="branch-selector-label"><span className="sr-only">Sucursal activa</span><SearchableSelect id="active-branch" aria-label="Sucursal activa" className="branch-selector-searchable" options={[{ value: '', label: 'Todas las sucursales' }, ...branches.map((branch) => ({ value: String(branch.branchId), label: branch.name }))]} value={activeBranchId === null ? '' : String(activeBranchId)} disabled={branchesLoading} onChange={(value) => setActiveBranchId(value ? Number(value) : null)} placeholder="Seleccionar sucursal" /></div>}
        <Avatar name={displayName ?? 'Usuario'} />
        <Button
          variant="outline"
          size="icon"
          id="btn-logout"
          type="button"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
