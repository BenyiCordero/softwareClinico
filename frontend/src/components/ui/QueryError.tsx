import { RefreshCw } from 'lucide-react'
import { Alert } from './Alert'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface QueryErrorProps { title?: string; message?: string; onRetry: () => void; className?: string }
export function QueryError({ title = 'No se pudo cargar la información', message = 'Revisa la conexión e inténtalo nuevamente.', onRetry, className }: QueryErrorProps) {
  return <Alert className={cn(className)} variant="danger" title={title}><div className="flex flex-wrap items-center justify-between gap-3"><span>{message}</span><Button type="button" variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>Reintentar</Button></div></Alert>
}
