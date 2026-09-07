import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Label } from './Label'

export interface FieldProps {
  label?: ReactNode
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: ReactNode
  className?: string
  children: ReactNode
}

export const Field = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className,
  children,
}: FieldProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? (
        <span className="mt-1 flex items-center gap-1 text-xs text-danger">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 text-xs text-ink-muted">{hint}</span>
      ) : null}
    </div>
  )
}