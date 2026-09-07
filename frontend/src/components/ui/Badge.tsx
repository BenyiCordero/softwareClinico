import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'

export type BadgeSize = 'sm' | 'md'

export type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-line-light text-ink-secondary',
  primary: 'bg-primary-light text-primary',
  secondary: 'bg-secondary-light text-primary',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  outline: 'border border-line text-ink-secondary',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[0.7rem]',
  md: 'px-2.5 py-1 text-xs',
}

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}