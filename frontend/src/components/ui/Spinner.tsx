import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export const Spinner = ({ size = 'md', label, className }: SpinnerProps) => {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink-muted', className)} role="status">
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}