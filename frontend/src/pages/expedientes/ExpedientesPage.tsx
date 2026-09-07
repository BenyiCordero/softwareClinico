import { ClipboardList } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function ExpedientesPage() {
  return (
    <PagePlaceholder
      title="Expedientes"
      icon={ClipboardList}
      description="Expedientes clínicos de los pacientes"
    />
  )
}
