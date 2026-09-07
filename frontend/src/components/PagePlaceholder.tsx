import type { LucideIcon } from 'lucide-react'
import { Badge, Card } from '@/components/ui'

interface PagePlaceholderProps {
  title: string
  icon?: LucideIcon
  description?: string
}

export default function PagePlaceholder({
  title,
  icon: Icon,
  description = 'Este módulo está en construcción.',
}: PagePlaceholderProps) {
  return (
    <div className="page-content">
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md p-8 text-center">
          {Icon && (
            <div className="bg-warning-light text-warning mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Icon className="h-8 w-8" />
            </div>
          )}
          <h2 className="text-ink text-xl font-bold">{title}</h2>
          <p className="text-ink-muted mt-1 text-sm">{description}</p>
          <div className="mt-4">
            <Badge variant="warning">Módulo en preparación</Badge>
          </div>
        </Card>
      </div>
    </div>
  )
}