import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export type FilterBarProps = ComponentPropsWithoutRef<'div'>

export const FilterBar = ({ className, children, ...props }: FilterBarProps) => {
  return (
    <div
      className={cn('mb-6 flex flex-wrap items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}