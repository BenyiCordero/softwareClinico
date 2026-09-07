import type { LucideIcon } from 'lucide-react'

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
      <div className="welcome-container">
        <div className="welcome-card text-center">
          {Icon && (
            <div className="welcome-icon mb-4">
              <Icon className="h-16 w-16" />
            </div>
          )}
          <h2 className="welcome-title">{title}</h2>
          <p className="welcome-text text-muted">{description}</p>
          <div className="mt-3">
            <span className="badge-status badge-warning">Módulo en preparación</span>
          </div>
        </div>
      </div>
    </div>
  )
}