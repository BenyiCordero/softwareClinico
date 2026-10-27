import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button, Card } from '@/components/ui'

interface Props { children: ReactNode }
interface State { hasError: boolean }
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(): State { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Unhandled application error', error, info) }
  render() { if (!this.state.hasError) return this.props.children; return <div className="flex min-h-screen items-center justify-center bg-app-bg p-6"><Card className="w-full max-w-lg p-8 text-center"><TriangleAlert className="mx-auto h-10 w-10 text-danger" /><h1 className="mt-4 text-xl font-bold text-ink">Ocurrió un error inesperado</h1><p className="mt-2 text-sm text-ink-muted">Recarga la pantalla para continuar. Si el problema persiste, contacta al administrador.</p><Button className="mt-6" onClick={() => window.location.reload()} leftIcon={<RefreshCw className="h-4 w-4" />}>Recargar aplicación</Button></Card></div> }
}
