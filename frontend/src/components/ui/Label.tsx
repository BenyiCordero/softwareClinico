import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('mb-1.5 block text-sm font-medium text-ink-secondary', className)}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
    )
  },
)

Label.displayName = 'Label'