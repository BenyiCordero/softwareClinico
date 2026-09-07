import { cn } from '@/lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

export const Avatar = ({ name, size = 'md', className }: AvatarProps) => {
  const initial = (name.trim().charAt(0) || '?').toUpperCase()
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary-light font-semibold text-primary',
        sizeClasses[size],
        className,
      )}
      aria-label={name}
      title={name}
    >
      {initial}
    </span>
  )
}