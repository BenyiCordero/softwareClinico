import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div id="dashboard-view">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <main id="main-content">
            <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-muted" role="status" aria-live="polite">Cargando módulo...</div>}><Outlet /></Suspense>
      </main>
    </div>
  )
}
