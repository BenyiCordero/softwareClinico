import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SearchableOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SearchableSelectProps {
  options: SearchableOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Buscar...',
  emptyText = 'Sin resultados',
  disabled = false,
  error = false,
  className,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const selected = options.find((option) => option.value === value)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return options
    return options.filter((option) => option.label.toLowerCase().includes(term))
  }, [options, query])

  const handleSelect = (option: SearchableOption) => {
    onChange(option.value)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex h-9 w-full items-center rounded-lg border-[1.5px] bg-surface transition-[border-color,box-shadow]',
          'focus-within:ring-[3px]',
          error
            ? 'border-danger focus-within:border-danger focus-within:ring-danger/15'
            : 'border-line focus-within:border-primary focus-within:ring-primary/15',
          disabled && 'cursor-not-allowed bg-line-light/60 opacity-70',
        )}
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          readOnly={!open}
          value={open ? query : selected?.label ?? ''}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onChange={(event) => setQuery(event.target.value)}
          className="h-full w-full cursor-pointer rounded-lg border-none bg-transparent pl-9 pr-9 text-sm text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed disabled:bg-transparent"
        />
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3 h-4 w-4 text-ink-muted transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </div>

      {open && !disabled && (
        <div className="animate-fade-in absolute left-0 right-0 top-full z-[60] mt-2 max-h-[220px] overflow-y-auto rounded-lg border-[1.5px] border-line bg-surface shadow-md">
          {filtered.length === 0 && (
            <div className="px-3 py-3 text-sm italic text-ink-muted">{emptyText}</div>
          )}
          {filtered.map((option) => {
            const isSelected = option.value === value
            const isDisabled = option.disabled
            return (
              <button
                key={option.value}
                type="button"
                disabled={isDisabled}
                onMouseDown={(event) => {
                  event.preventDefault()
                  if (!isDisabled) handleSelect(option)
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left text-sm transition-colors',
                  'hover:bg-primary-light focus:bg-primary-light focus:outline-none',
                  isSelected && 'bg-primary-light font-medium text-primary',
                  isDisabled && 'cursor-default italic text-ink-muted',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}