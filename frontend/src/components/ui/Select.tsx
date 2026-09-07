import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error = false, children, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        <select
          ref={ref}
          className={cn(
            'h-9 w-full cursor-pointer appearance-none rounded-lg border-[1.5px] bg-surface pl-3 pr-9 text-sm text-ink transition-[border-color,box-shadow]',
            'focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-line-light/60',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/15'
              : 'border-line focus:border-primary focus:ring-primary/15',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      </div>
    )
  },
)

Select.displayName = 'Select'