import { RotateCcw, Search } from 'lucide-react'
import { Button } from './Button'

interface FilterActionsProps {
  onClear?: () => void
  clearLabel?: string
  searchLabel?: string
  loading?: boolean
}

export function FilterActions({ onClear, clearLabel = 'Limpiar', searchLabel = 'Buscar', loading = false }: FilterActionsProps) {
  return <div className="flex items-center gap-2"><Button type="submit" loading={loading} leftIcon={<Search className="h-4 w-4" />}>{searchLabel}</Button>{onClear && <Button type="button" variant="outline" onClick={onClear} leftIcon={<RotateCcw className="h-4 w-4" />}>{clearLabel}</Button>}</div>
}
