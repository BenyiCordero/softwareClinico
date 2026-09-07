import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TooltipProps {
  text: string
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

export const Tooltip = ({ text, children, side = 'top', className }: TooltipProps) => {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        )}
      >
        {text}
      </span>
    </span>
  )
}