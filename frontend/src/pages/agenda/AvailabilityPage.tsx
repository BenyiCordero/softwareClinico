import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { CalendarClock } from 'lucide-react'
import { Badge, Button, DataTable, Field, Input, PageHeader, QueryError, type DataTableColumn } from '@/components/ui'
import { agendaApi } from '@/features/agenda/agenda.api'
import type { AvailabilitySlot } from '@/features/agenda/agenda.models'

export default function AvailabilityPage() {
  const [filters, setFilters] = useState({ scheduleId: '', date: '' })
  const [submitted, setSubmitted] = useState<typeof filters | null>(null)
  const query = useQuery({ queryKey: ['availability', submitted], queryFn: () => agendaApi.availability(Number(submitted?.scheduleId), { date: submitted?.date ?? '' }), enabled: submitted !== null && Number(submitted.scheduleId) > 0 && Boolean(submitted.date) })
  const columns: DataTableColumn<AvailabilitySlot>[] = [{ key: 'startAt', header: 'Inicio', cell: (item) => new Date(item.startAt).toLocaleString() }, { key: 'endAt', header: 'Fin', cell: (item) => new Date(item.endAt).toLocaleTimeString() }, { key: 'scheduleId', header: 'Agenda', cell: (item) => item.scheduleId }, { key: 'available', header: 'Disponibilidad', cell: (item) => <Badge variant={item.available ? 'success' : 'danger'} dot>{item.available ? 'Disponible' : 'Ocupado'}</Badge> }]
  return <div className="page-content"><PageHeader title="Disponibilidad" description="Consulta espacios disponibles por agenda y fecha." /><form className="panel-card mb-5 grid gap-4 p-5 sm:grid-cols-2" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(filters) }}><Field label="ID de agenda" htmlFor="availability-schedule" required><Input id="availability-schedule" type="number" value={filters.scheduleId} onChange={(event) => setFilters({ ...filters, scheduleId: event.target.value })} required /></Field><Field label="Fecha" htmlFor="availability-date" required><Input id="availability-date" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} required /></Field><Button type="submit" leftIcon={<CalendarClock className="h-4 w-4" />}>Consultar</Button></form>{query.isError && <QueryError className="mb-5" title="No se pudo cargar la disponibilidad" message="Verifica la agenda y la conexión con el servicio." onRetry={() => void query.refetch()} />}<div className="panel-card overflow-hidden"><DataTable columns={columns} data={query.data ?? []} keyExtractor={(item) => `${item.scheduleId}-${item.startAt}`} loading={query.isLoading} emptyTitle="Sin espacios" emptyDescription="No hay espacios disponibles para los filtros actuales." /></div></div>
}
