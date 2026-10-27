import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '@/components/ui'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return <div className="flex min-h-screen items-center justify-center bg-app-bg p-6"><Card className="w-full max-w-lg p-8 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary"><SearchX className="h-8 w-8" /></div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Error 404</p><h1 className="mt-2 text-2xl font-bold text-ink">Página no encontrada</h1><p className="mt-2 text-sm text-ink-muted">La dirección solicitada no existe o ya no está disponible.</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button><Button onClick={() => navigate('/dashboard')} leftIcon={<Home className="h-4 w-4" />}>Panel principal</Button></div></Card></div>
}
