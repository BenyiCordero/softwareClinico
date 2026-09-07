import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  variant?: AlertVariant
  title?: ReactNode
  children?: ReactNode
  className?: string
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-primary/20 bg-primary-light text-primary',
  success: 'border-success/20 bg-success-light text-success',
  warning: 'border-warning/20 bg-warning-light text-warning',
  danger: 'border-danger/20 bg-danger-light text-danger',
}

const iconMap: Record<AlertVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

export const Alert = ({ variant = 'info', title, children, className }: AlertProps) => {
  const Icon = iconMap[variant]
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-[10px] border px-4 py-3 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        {title && <div className="font-semibold">{title}</div>}
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
    </div>
  )
}