import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Align = 'left' | 'center' | 'right'

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const Table = ({ className, ...props }: ComponentProps<'table'>) => {
  return <table className={cn('w-full border-collapse text-sm', className)} {...props} />
}

export const THead = ({ className, ...props }: ComponentProps<'thead'>) => {
  return <thead className={cn('bg-app-bg', className)} {...props} />
}

export const TBody = ({ className, ...props }: ComponentProps<'tbody'>) => {
  return <tbody className={className} {...props} />
}

export const TFoot = ({ className, ...props }: ComponentProps<'tfoot'>) => {
  return (
    <tfoot
      className={cn('border-t border-line bg-app-bg font-semibold text-ink', className)}
      {...props}
    />
  )
}

export const TR = ({ className, ...props }: ComponentProps<'tr'>) => {
  return (
    <tr
      className={cn(
        'transition-colors duration-150 hover:bg-primary-light',
        className,
      )}
      {...props}
    />
  )
}

export interface THProps extends ComponentProps<'th'> {
  align?: Align
}

export const TH = ({ className, align = 'left', ...props }: THProps) => {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b-2 border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted',
        alignClass[align],
        className,
      )}
      {...props}
    />
  )
}

export interface TDProps extends ComponentProps<'td'> {
  align?: Align
}

export const TD = ({ className, align = 'left', ...props }: TDProps) => {
  return (
    <td
      className={cn(
        'border-b border-line-light px-4 py-3 align-middle text-ink',
        alignClass[align],
        className,
      )}
      {...props}
    />
  )
}