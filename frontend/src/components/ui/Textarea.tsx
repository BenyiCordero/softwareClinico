import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border-[1.5px] bg-surface px-3 py-2 text-sm leading-relaxed text-ink transition-[border-color,box-shadow]',
          'placeholder:text-ink-muted focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-line-light/60',
          error
            ? 'border-danger focus:border-danger focus:ring-danger/15'
            : 'border-line focus:border-primary focus:ring-primary/15',
          className,
        )}
        {...props}
      />
    )
  },
)

Textarea.displayName = 'Textarea'