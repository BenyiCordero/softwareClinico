import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-line', className)}
      {...props}
    />
  )
}