import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type InputSize = 'sm' | 'md'

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  inputSize?: InputSize
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, leading, trailing, inputSize = 'md', ...props }, ref) => {
    return (
      <div className={cn('relative flex w-full items-center', className)}>
        {leading && <span className="pointer-events-none absolute left-3 text-ink-muted">{leading}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border-[1.5px] bg-surface text-ink transition-[border-color,box-shadow]',
            'placeholder:text-ink-muted focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-line-light/60',
            inputSize === 'md' ? 'h-9 px-3 text-sm' : 'h-8 px-2.5 text-xs',
            leading && 'pl-10',
            trailing && 'pr-10',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/15'
              : 'border-line focus:border-primary focus:ring-primary/15',
            className,
          )}
          {...props}
        />
        {trailing && <span className="pointer-events-none absolute right-3 text-ink-muted">{trailing}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'