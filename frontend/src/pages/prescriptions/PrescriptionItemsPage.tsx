import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useCan } from '@/app/providers/branch-context'
import { Alert, Button, ConfirmDialog, DataTable, Field, Input, PageHeader, toast, type DataTableColumn } from '@/components/ui'
import { ApiError } from '@/infrastructure/http'
import { prescriptionsApi } from '@/features/prescriptions/prescription.api'
import type { PrescriptionItem } from '@/features/prescriptions/prescription.models'

const errorText = (error: unknown) => error instanceof ApiError ? error.messages.join(' ') : error instanceof Error ? error.message : 'No fue posible completar la operación.'

export default function PrescriptionItemsPage() {
  const id = Number(useParams().id)
  const client = useQueryClient()
  const canUpdate = useCan('prescriptions.update')
  const [removing, setRemoving] = useState<PrescriptionItem | null>(null)
  const query = useQuery({ queryKey: ['prescription-items', id], queryFn: () => prescriptionsApi.items(id), enabled: id > 0 })
  const add = useMutation({ mutationFn: (form: HTMLFormElement) => prescriptionsApi.createItem(id, Object.fromEntries(new FormData(form))), onSuccess: () => { void client.invalidateQueries({ queryKey: ['prescription-items', id] }); toast.success('Medicamento agregado.') } })
  const remove = useMutation({ mutationFn: (itemId: number) => prescriptionsApi.removeItem(id, itemId), onSuccess: () => { void client.invalidateQueries({ queryKey: ['prescription-items', id] }); setRemoving(null); toast.success('Medicamento eliminado.') } })
  const columns: DataTableColumn<PrescriptionItem>[] = [{ key: 'medication', header: 'Medicamento', cell: (item) => item.medication }, { key: 'dose', header: 'Dosis', cell: (item) => item.dose }, { key: 'route', header: 'Vía', cell: (item) => item.route ?? '-' }, { key: 'frequency', header: 'Frecuencia', cell: (item) => item.frequency }, { key: 'duration', header: 'Duración', cell: (item) => item.duration }, { key: 'actions', header: '', align: 'right', cell: (item) => <Button variant="ghost" size="icon" title="Eliminar" aria-label="Eliminar medicamento" disabled={!canUpdate} onClick={() => setRemoving(item)}><Trash2 className="h-4 w-4 text-danger" /></Button> }]
  return <div className="page-content"><PageHeader title="Medicamentos de la receta" description="Captura dosis, vía, frecuencia, duración e instrucciones." actions={<Link className="inline-flex h-9 items-center rounded-lg border border-line px-4 text-sm" to="/dashboard/prescriptions">Volver</Link>} /><div className="panel-card mb-5 p-5"><form className="grid gap-4 sm:grid-cols-4" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (canUpdate) add.mutate(event.currentTarget) }}>{[['medication', 'Medicamento', true], ['presentation', 'Presentación', false], ['dose', 'Dosis', true], ['route', 'Vía', false], ['frequency', 'Frecuencia', true], ['duration', 'Duración', true], ['instructions', 'Indicaciones', false]].map(([name, label, required]) => <Field key={String(name)} label={String(label)} htmlFor={String(name)} required={Boolean(required)}><Input id={String(name)} name={String(name)} required={Boolean(required)} disabled={!canUpdate} /></Field>)}<Button type="submit" loading={add.isPending} disabled={!canUpdate} leftIcon={<Plus className="h-4 w-4" />}>Agregar</Button></form>{add.isError && <Alert className="mt-4" variant="danger" title="No se pudo agregar">{errorText(add.error)}</Alert>}</div><div className="panel-card overflow-hidden"><DataTable columns={columns} data={query.data ?? []} keyExtractor={(item) => item.prescriptionItemId} loading={query.isLoading} emptyTitle="Sin medicamentos" emptyDescription="Agrega el primer medicamento a la receta." /></div><ConfirmDialog open={removing !== null} onClose={() => setRemoving(null)} onConfirm={() => removing && canUpdate && remove.mutate(removing.prescriptionItemId)} loading={remove.isPending} title="¿Eliminar medicamento?" description="El medicamento será retirado de la receta." confirmText="Eliminar" /></div>
}
