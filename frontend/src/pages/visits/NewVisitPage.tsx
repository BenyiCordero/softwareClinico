import { Stethoscope } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function NewVisitPage() {
  return (
    <PagePlaceholder
      title="Nueva Consulta"
      icon={Stethoscope}
      description="Registro de una nueva consulta médica"
    />
  )
}
