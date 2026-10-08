import { PillBottle } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function MedicationCatalogPage() {
  return (
    <PagePlaceholder
      title="Catálogo de Medicamentos"
      icon={PillBottle}
      description="Inventario de medicamentos de la farmacia"
    />
  )
}
