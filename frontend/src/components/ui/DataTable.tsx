import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Table, THead, TBody, TR, TH, TD } from './Table'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'

export interface DataTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  loading?: boolean
  skeletonRows?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: LucideIcon
  rowClassName?: (row: T) => string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends object>({
  columns,
  data,
  keyExtractor,
  loading = false,
  skeletonRows = 5,
  emptyTitle = 'Sin registros',
  emptyDescription = 'No hay datos para mostrar con los criterios actuales.',
  emptyIcon,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            {columns.map((col) => (
              <TH key={col.key} align={col.headerAlign ?? col.align} className={col.headerClassName}>
                {col.header}
              </TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <TR key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <TD key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TD>
                  ))}
                </TR>
              ))
            : data.length === 0
              ? (
                  <TR>
                    <TD colSpan={columns.length} className="border-b-0 p-0">
                      <EmptyState
                        icon={emptyIcon}
                        title={emptyTitle}
                        description={emptyDescription}
                        className="py-14"
                      />
                    </TD>
                  </TR>
                )
              : data.map((row) => (
                  <TR
                    key={keyExtractor(row)}
                    className={cn(onRowClick && 'cursor-pointer', rowClassName?.(row))}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((col) => (
                      <TD key={col.key} align={col.align} className={col.className}>
                        {col.cell(row)}
                      </TD>
                    ))}
                  </TR>
                ))}
        </TBody>
      </Table>
    </div>
  )
}