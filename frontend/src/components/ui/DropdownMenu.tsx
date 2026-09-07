import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DropdownMenuItem {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  className?: string
}

export const DropdownMenu = ({
  trigger,
  items,
  align = 'right',
  className,
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer focus-visible:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'animate-fade-in absolute top-full z-50 mt-2 min-w-[180px] rounded-lg border border-line bg-surface py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false)
                  item.onClick?.()
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  'hover:bg-line-light disabled:cursor-not-allowed disabled:opacity-50',
                  item.danger ? 'text-danger hover:bg-danger-light' : 'text-ink',
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}