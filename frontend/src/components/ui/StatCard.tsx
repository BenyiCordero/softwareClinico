import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export type StatCardVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

export interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  helper?: string
  variant?: StatCardVariant
  className?: string
}

const iconVariantClasses: Record<StatCardVariant, string> = {
  primary: 'bg-primary-light text-primary',
  secondary: 'bg-secondary-light text-primary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  helper,
  variant = 'primary',
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'flex h-full items-center gap-3 rounded-[10px] border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
          iconVariantClasses[variant],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate whitespace-nowrap text-xl font-bold leading-tight text-ink">
          {value}
        </div>
        <div className="truncate whitespace-nowrap text-xs text-ink-muted">
          {label}
          {helper && <span className="ml-1 text-ink-muted/80">· {helper}</span>}
        </div>
      </div>
    </div>
  )
}