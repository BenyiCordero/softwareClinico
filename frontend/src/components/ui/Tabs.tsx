import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface TabItem {
  value: string
  label: ReactNode
  icon?: LucideIcon
}

export interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export const Tabs = ({ tabs, value, onChange, className }: TabsProps) => {
  return (
    <div className={cn('flex gap-1 overflow-x-auto border-b border-line', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex shrink-0 cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              active ? 'text-primary' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}