import { HeartPulse } from 'lucide-react'
import { Card, PageHeader } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div className="page-content">
      <PageHeader
        title="Bienvenido al Sistema"
        description="Selecciona un módulo en el menú lateral para comenzar"
      />
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="bg-primary-light text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h2 className="text-ink text-xl font-bold">Bienvenido al Sistema</h2>
          <p className="text-ink-muted mt-1 text-sm">Selecciona un módulo en el menú lateral para comenzar</p>
        </Card>
      </div>
    </div>
  )
}
