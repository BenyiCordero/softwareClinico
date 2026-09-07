import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const Card = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'rounded-[10px] border border-line bg-surface shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-line-light px-5 py-4',
        className,
      )}
      {...props}
    />
  )
}

export const CardTitle = ({ className, children, ...props }: ComponentProps<'h3'>) => {
  return (
    <h3 className={cn('text-base font-bold text-ink', className)} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ className, children, ...props }: ComponentProps<'p'>) => {
  return (
    <p className={cn('mt-0.5 text-sm text-ink-muted', className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('px-5 py-4', className)} {...props} />
}

export const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-2 border-t border-line-light px-5 py-3',
        className,
      )}
      {...props}
    />
  )
}