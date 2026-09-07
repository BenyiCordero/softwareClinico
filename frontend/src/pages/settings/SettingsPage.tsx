import { SlidersHorizontal } from 'lucide-react'
import PagePlaceholder from '@/components/PagePlaceholder'

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Configuración"
      icon={SlidersHorizontal}
      description="Configuración general del sistema"
    />
  )
}
