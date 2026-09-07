import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  onBack?: () => void
  className?: string
}

export const PageHeader = ({
  title,
  description,
  actions,
  onBack,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn('mb-6 flex flex-wrap items-center justify-between gap-4', className)}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-secondary transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h4 className="text-xl font-bold text-ink">{title}</h4>
          {description && <small className="text-sm text-ink-muted">{description}</small>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}