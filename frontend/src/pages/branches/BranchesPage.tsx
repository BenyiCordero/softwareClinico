import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Edit2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Badge, Button, DataTable, Field, FilterBar, Input, Modal, PageHeader, Pagination, Select, ConfirmDialog, toast } from '@/components/ui'
import type { DataTableColumn } from '@/components/ui'
import { useBranch } from '@/app/providers/branch-context'
import { ApiError } from '@/infrastructure/http'
import { branchFormSchema, type BranchFormValues } from '@/features/branches/branch.schemas'
import type { Branch, BranchStatus } from '@/features/branches/branch.types'
import { useBranchesQuery, useCreateBranchMutation, useRemoveBranchMutation, useUpdateBranchMutation } from '@/features/branches/branch.queries'

const statusLabels: Record<BranchStatus, string> = {
  ACTIVE: 'Activa',
  TEMPORARILY_CLOSED: 'Cierre temporal',
  INACTIVE: 'Inactiva',
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.messages.join(' ')
  if (error instanceof Error) return error.message
  return 'No fue posible completar la operación.'
}

interface BranchFormProps {
  branch: Branch | null
  loading: boolean
  serverError: string | null
  onSubmit: (values: BranchFormValues) => Promise<void>
}

function BranchForm({ branch, loading, serverError, onSubmit }: BranchFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      code: branch?.code ?? '',
      name: branch?.name ?? '',
      phone: branch?.phone ?? '',
      email: branch?.email ?? '',
      address: branch?.address ?? '',
      city: branch?.city ?? '',
      state: branch?.state ?? '',
      postalCode: branch?.postalCode ?? '',
      timezone: branch?.timezone ?? 'America/Mexico_City',
      status: branch?.status ?? 'ACTIVE',
    },
  })

  return (
    <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && <Alert variant="danger" title="No se pudo guardar la sucursal">{serverError}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código" htmlFor="branch-code" required error={errors.code?.message}>
          <Input id="branch-code" error={Boolean(errors.code)} {...register('code')} />
        </Field>
        <Field label="Nombre" htmlFor="branch-name" required error={errors.name?.message}>
          <Input id="branch-name" error={Boolean(errors.name)} {...register('name')} />
        </Field>
        <Field label="Teléfono" htmlFor="branch-phone" required error={errors.phone?.message}>
          <Input id="branch-phone" error={Boolean(errors.phone)} {...register('phone')} />
        </Field>
        <Field label="Correo electrónico" htmlFor="branch-email" required error={errors.email?.message}>
          <Input id="branch-email" type="email" error={Boolean(errors.email)} {...register('email')} />
        </Field>
        <Field label="Dirección" htmlFor="branch-address" required error={errors.address?.message} className="sm:col-span-2">
          <Input id="branch-address" error={Boolean(errors.address)} {...register('address')} />
        </Field>
        <Field label="Ciudad" htmlFor="branch-city" required error={errors.city?.message}>
          <Input id="branch-city" error={Boolean(errors.city)} {...register('city')} />
        </Field>
        <Field label="Estado" htmlFor="branch-state" required error={errors.state?.message}>
          <Input id="branch-state" error={Boolean(errors.state)} {...register('state')} />
        </Field>
        <Field label="Código postal" htmlFor="branch-postal-code" required error={errors.postalCode?.message}>
          <Input id="branch-postal-code" error={Boolean(errors.postalCode)} {...register('postalCode')} />
        </Field>
        <Field label="Zona horaria" htmlFor="branch-timezone" required error={errors.timezone?.message}>
          <Input id="branch-timezone" error={Boolean(errors.timezone)} {...register('timezone')} />
        </Field>
        {branch && (
          <Field label="Estado" htmlFor="branch-status" required error={errors.status?.message}>
            <Select id="branch-status" error={Boolean(errors.status)} {...register('status')}>
              <option value="ACTIVE">Activa</option>
              <option value="TEMPORARILY_CLOSED">Cierre temporal</option>
              <option value="INACTIVE">Inactiva</option>
            </Select>
          </Field>
        )}
      </div>
      <button type="submit" className="sr-only" disabled={loading} aria-hidden="true" tabIndex={-1} />
    </form>
  )
}

export default function BranchesPage() {
  const { can } = useBranch()
  const canCreate = can('branches.create')
  const canUpdate = can('branches.update')
  const canArchive = can('branches.archive')
  const [page, setPage] = useState(1)
  const [draftCode, setDraftCode] = useState('')
  const [draftName, setDraftName] = useState('')
  const [draftStatus, setDraftStatus] = useState<BranchStatus | ''>('')
  const [filters, setFilters] = useState<{ code?: string; name?: string; status?: BranchStatus }>({})
  const [editing, setEditing] = useState<Branch | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<Branch | null>(null)

  const branchesQuery = useBranchesQuery({ page, limit: 10, ...filters })
  const createMutation = useCreateBranchMutation()
  const updateMutation = useUpdateBranchMutation()
  const removeMutation = useRemoveBranchMutation()
  const rows = branchesQuery.data?.data ?? []
  const pagination = branchesQuery.data?.pagination
  const pageCount = pagination?.type === 'OFFSET' ? pagination.totalPages : 0
  const isSaving = createMutation.isPending || updateMutation.isPending

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (branch: Branch) => {
    setEditing(branch)
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (isSaving) return
    setFormOpen(false)
    setEditing(null)
    setFormError(null)
  }

  const handleSave = async (values: BranchFormValues) => {
    setFormError(null)
    try {
      if (editing) {
        const { status, ...fields } = values
        await updateMutation.mutateAsync({ branchId: editing.branchId, input: { ...fields, status } })
        toast.success('Sucursal actualizada correctamente.')
      } else {
        const fields = { ...values }
        delete fields.status
        await createMutation.mutateAsync(fields)
        toast.success('Sucursal creada correctamente.')
      }
      closeForm()
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const handleRemove = async () => {
    if (!removing) return
    try {
      await removeMutation.mutateAsync(removing.branchId)
      toast.success('Sucursal archivada correctamente.')
      setRemoving(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setFilters({
      code: draftCode.trim() || undefined,
      name: draftName.trim() || undefined,
      status: draftStatus || undefined,
    })
  }

  const resetFilters = () => {
    setDraftCode('')
    setDraftName('')
    setDraftStatus('')
    setFilters({})
    setPage(1)
  }

  const columns: DataTableColumn<Branch>[] = [
    { key: 'code', header: 'Código', cell: (branch) => <span className="font-semibold text-ink">{branch.code}</span> },
    { key: 'name', header: 'Sucursal', cell: (branch) => <span>{branch.name}</span> },
    { key: 'location', header: 'Ubicación', cell: (branch) => <span>{branch.city}, {branch.state}</span> },
    { key: 'phone', header: 'Teléfono', cell: (branch) => <span>{branch.phone}</span> },
    { key: 'status', header: 'Estado', cell: (branch) => <Badge variant={branch.status === 'ACTIVE' ? 'success' : branch.status === 'TEMPORARILY_CLOSED' ? 'warning' : 'neutral'} dot>{statusLabels[branch.status]}</Badge> },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (branch) => (
        <div className="flex justify-end gap-1">
          {canUpdate && <Button variant="ghost" size="icon" title="Editar sucursal" onClick={() => openEdit(branch)}><Edit2 className="h-4 w-4" /></Button>}
          {canArchive && branch.status !== 'INACTIVE' && <Button variant="ghost" size="icon" title="Archivar sucursal" onClick={() => setRemoving(branch)}><Trash2 className="h-4 w-4 text-danger" /></Button>}
        </div>
      ),
    },
  ]

  if (!can('branches.read')) {
    return <div className="page-content"><Alert variant="danger" title="Acceso denegado">No tienes permiso para consultar sucursales.</Alert></div>
  }

  return (
    <div className="page-content">
      <PageHeader
        title="Sucursales"
        description="Administra las sedes y el alcance operativo de la clínica."
        actions={canCreate && <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>Nueva sucursal</Button>}
      />

      <form onSubmit={applyFilters}>
        <FilterBar>
          <Input value={draftCode} onChange={(event) => setDraftCode(event.target.value)} placeholder="Buscar por código" leading={<Search className="h-4 w-4" />} />
          <Input value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Buscar por nombre" />
          <Select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as BranchStatus | '')} className="max-w-[210px]">
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activas</option>
            <option value="TEMPORARILY_CLOSED">Cierre temporal</option>
            <option value="INACTIVE">Inactivas</option>
          </Select>
          <Button type="submit" leftIcon={<Search className="h-4 w-4" />}>Buscar</Button>
          <Button type="button" variant="outline" onClick={resetFilters}>Limpiar</Button>
        </FilterBar>
      </form>

      {branchesQuery.isError && (
        <Alert variant="danger" title="No se pudieron cargar las sucursales" className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{getErrorMessage(branchesQuery.error)}</span>
            <Button variant="outline" size="sm" onClick={() => void branchesQuery.refetch()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>Reintentar</Button>
          </div>
        </Alert>
      )}

      <div className="panel-card overflow-hidden">
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(branch) => branch.branchId}
          loading={branchesQuery.isLoading}
          emptyIcon={Building2}
          emptyTitle="No hay sucursales"
          emptyDescription="Crea la primera sucursal o ajusta los filtros de búsqueda."
        />
        {pagination?.type === 'OFFSET' && (
          <Pagination page={pagination.page} pageCount={pageCount} total={pagination.totalItems} pageSize={pagination.limit} showTotal onChange={setPage} />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? 'Editar sucursal' : 'Nueva sucursal'}
        description="Completa los datos requeridos por el sistema."
        size="lg"
        closeOnBackdrop={!isSaving}
        footer={
          <>
            <Button variant="outline" onClick={closeForm} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" form="branch-form" loading={isSaving}>{editing ? 'Guardar cambios' : 'Crear sucursal'}</Button>
          </>
        }
      >
        {formOpen && <BranchForm key={editing?.branchId ?? 'new'} branch={editing} loading={isSaving} serverError={formError} onSubmit={handleSave} />}
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        onClose={() => { if (!removeMutation.isPending) setRemoving(null) }}
        onConfirm={() => void handleRemove()}
        loading={removeMutation.isPending}
        title="¿Archivar sucursal?"
        description={`La sucursal ${removing?.name ?? ''} quedará inactiva y no se eliminará físicamente.`}
        confirmText="Archivar"
      />
    </div>
  )
}
