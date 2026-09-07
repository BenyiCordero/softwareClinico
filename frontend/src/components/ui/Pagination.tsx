import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

export interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
  total?: number
  pageSize?: number
  showTotal?: boolean
  className?: string
}

const buildPages = (page: number, pageCount: number): (number | 'ellipsis')[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < pageCount - 1) pages.push('ellipsis')
  pages.push(pageCount)
  return pages
}

export const Pagination = ({
  page,
  pageCount,
  onChange,
  total,
  pageSize,
  showTotal = false,
  className,
}: PaginationProps) => {
  if (pageCount <= 1) return null
  const pages = buildPages(page, pageCount)
  const from = total && pageSize ? (page - 1) * pageSize + 1 : undefined
  const to = total && pageSize ? Math.min(page * pageSize, total) : undefined

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-5 py-3',
        className,
      )}
    >
      {showTotal && total !== undefined && from !== undefined && to !== undefined ? (
        <span className="text-sm text-ink-muted">
          Mostrando <span className="font-medium text-ink">{from}</span>-
          <span className="font-medium text-ink">{to}</span> de{' '}
          <span className="font-medium text-ink">{total}</span>
        </span>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-ink-muted">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={cn(
                'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                item === page
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink-secondary hover:bg-primary-light hover:text-primary',
              )}
            >
              {item}
            </button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}