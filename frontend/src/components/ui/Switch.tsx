import { cn } from '@/lib/cn'

export const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
  disabled?: boolean
  className?: string
  'aria-label'?: string
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-60',
        checked ? 'bg-primary' : 'bg-line',
        className,
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[21px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}