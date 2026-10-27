import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card } from '@/components/ui'
export default function AccessDenied() { const navigate = useNavigate(); return <div className="page-content"><Card className="mx-auto max-w-xl p-8 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-danger" /><h1 className="mt-4 text-xl font-bold text-ink">Acceso denegado</h1><Alert className="mt-4 text-left" variant="danger" title="Permiso insuficiente">Tu usuario no tiene autorización para consultar este módulo.</Alert><Button className="mt-6" variant="outline" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button></Card></div> }
