import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useForm, type Resolver } from 'react-hook-form'
import type { ZodTypeAny } from 'zod'
import { useBranch } from '@/app/providers/branch-context'
import { Alert, Badge, Button, ConfirmDialog, DataTable, Field, FilterBar, Input, Modal, PageHeader, Pagination, Select, toast } from '@/components/ui'
import type { DataTableColumn } from '@/components/ui'
import { ApiError } from '@/infrastructure/http'
import type { CatalogListQuery, CatalogPage } from './catalog.types'

type FormValues = Record<string, string>
type FilterField = 'code' | 'name' | 'status' | 'email' | 'phone' | 'curp' | 'rfc' | 'branchId' | 'areaId' | 'parentAreaId'

export interface CatalogField {
  name: string
  label: string
  type?: 'text' | 'email' | 'date' | 'number'
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

export interface CatalogCrudConfig<TItem extends object> {
  queryKey: string
  title: string
  description: string
  endpoint: string
  idField: string
  fields: CatalogField[]
  filterFields?: FilterField[]
  filterStatusOptions?: Array<{ value: string; label: string }>
  schema: ZodTypeAny
  defaultValues: FormValues
  permissions: { read: string; create: string; update: string; archive?: string }
  list: (query: CatalogListQuery) => Promise<CatalogPage<TItem>>
  create: (input: Record<string, unknown>) => Promise<TItem>
  update: (id: number, input: Record<string, unknown>) => Promise<TItem>
  remove: (id: number) => Promise<void>
  toCreateInput?: (values: FormValues) => Record<string, unknown>
  toUpdateInput?: (values: FormValues) => Record<string, unknown>
  getId: (item: TItem) => number
  getCell: (item: TItem, field: string) => ReactNode
  detailPath?: (item: TItem) => string
  extraActions?: Array<{ label: string; permission: string; when?: (item: TItem) => boolean; execute: (item: TItem) => Promise<void> }>
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.messages.join(' ')
  if (error instanceof Error) return error.message
  return 'No fue posible completar la operación.'
}

function statusVariant(value: string): 'success' | 'warning' | 'neutral' | 'danger' {
  if (value === 'ACTIVE' || value === 'AVAILABLE') return 'success'
  if (value === 'MAINTENANCE' || value === 'TEMPORARILY_CLOSED' || value === 'TEMPORARILY_UNAVAILABLE') return 'warning'
  return value === 'INACTIVE' ? 'neutral' : 'danger'
}

function statusLabel(value: string): string {
  return {
    ACTIVE: 'Activo', INACTIVE: 'Inactivo', AVAILABLE: 'Disponible', MAINTENANCE: 'Mantenimiento',
    TEMPORARILY_CLOSED: 'Cierre temporal', TEMPORARILY_UNAVAILABLE: 'No disponible temporalmente',
  }[value] ?? value
}

interface CatalogFormProps {
  config: CatalogCrudConfig<object>
  values: FormValues
  loading: boolean
  serverError: string | null
  onSubmit: (values: FormValues) => Promise<void>
}

function CatalogForm({ config, values, loading, serverError, onSubmit }: CatalogFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(config.schema as never) as Resolver<FormValues>,
    defaultValues: values,
  })

  return (
    <form id="catalog-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      {serverError && <div className="sm:col-span-2"><Alert variant="danger" title="No se pudo guardar">{serverError}</Alert></div>}
      {config.fields.map((field) => {
        const error = errors[field.name]?.message as string | undefined
        return (
          <Field key={field.name} label={field.label} htmlFor={`catalog-${field.name}`} required={field.required} error={error}>
            {field.options ? (
              <Select id={`catalog-${field.name}`} error={Boolean(error)} {...register(field.name)}>
                <option value="">Selecciona una opción</option>
                {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            ) : (
              <Input id={`catalog-${field.name}`} type={field.type ?? 'text'} error={Boolean(error)} {...register(field.name)} />
            )}
          </Field>
        )
      })}
      <button type="submit" className="sr-only" disabled={loading} aria-hidden="true" tabIndex={-1} />
    </form>
  )
}

export default function CatalogCrudPage<TItem extends object>({ config }: { config: CatalogCrudConfig<TItem> }) {
  const { can } = useBranch()
  const canRead = can(config.permissions.read)
  const canCreate = can(config.permissions.create)
  const canUpdate = can(config.permissions.update)
  const canArchive = config.permissions.archive ? can(config.permissions.archive) : false
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState<FormValues>({})
  const [draftFilters, setDraftFilters] = useState<FormValues>({})
  const [editing, setEditing] = useState<TItem | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<TItem | null>(null)
  const [runningAction, setRunningAction] = useState<number | null>(null)

  const query = useQuery({
    queryKey: [config.queryKey, 'list', page, filterValues],
    queryFn: () => config.list({ page, limit: 10, ...filterValues }),
    enabled: canRead,
  })
  const createMutation = useMutation({ mutationFn: config.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }) })
  const updateMutation = useMutation({ mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => config.update(id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }) })
  const removeMutation = useMutation({ mutationFn: config.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: [config.queryKey] }) })
  const rows = query.data?.data ?? []
  const pagination = query.data?.pagination
  const pageCount = pagination?.type === 'OFFSET' ? pagination.totalPages : 0
  const isSaving = createMutation.isPending || updateMutation.isPending

  if (!canRead) return <div className="page-content"><Alert variant="danger" title="Acceso denegado">No tienes permiso para consultar este catálogo.</Alert></div>

  const getFormValues = (item: TItem | null): FormValues => {
    const result: FormValues = { ...config.defaultValues }
    if (!item) return result
    for (const field of config.fields) result[field.name] = String((item as Record<string, unknown>)[field.name] ?? '')
    return result
  }

  const save = async (values: FormValues) => {
    setFormError(null)
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: config.getId(editing), input: config.toUpdateInput?.(values) ?? values })
        toast.success(`${config.title} actualizado correctamente.`)
      } else {
        const createValues = { ...values }
        delete createValues.status
        await createMutation.mutateAsync(config.toCreateInput?.(createValues) ?? createValues)
        toast.success(`${config.title} creado correctamente.`)
      }
      setFormOpen(false)
      setEditing(null)
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const remove = async () => {
    if (!removing) return
    try {
      await removeMutation.mutateAsync(config.getId(removing))
      toast.success(`${config.title} archivado correctamente.`)
      setRemoving(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const filters: FormValues = {}
    for (const field of config.filterFields ?? []) {
      if (draftFilters[field]) filters[field] = draftFilters[field]
    }
    setFilterValues(filters)
    setPage(1)
  }

  const columns: DataTableColumn<TItem>[] = config.fields.slice(0, 5).map((field) => ({
    key: field.name,
    header: field.label,
    cell: (item) => field.name === 'status' ? <Badge variant={statusVariant(String((item as Record<string, unknown>)[field.name] ?? ''))} dot>{statusLabel(String((item as Record<string, unknown>)[field.name] ?? ''))}</Badge> : config.getCell(item, field.name),
  }))
  columns.push({
    key: 'actions', header: 'Acciones', align: 'right', cell: (item) => (
      <div className="flex justify-end gap-1">
        {config.detailPath && <Link className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-line-light hover:text-ink" to={config.detailPath(item)} title="Administrar relaciones" aria-label="Administrar relaciones">↗</Link>}
        {config.extraActions?.map((action, index) => can(action.permission) && (action.when?.(item) ?? true) && <Button key={action.label} variant="ghost" size="sm" loading={runningAction === index} disabled={runningAction !== null} onClick={async () => { setRunningAction(index); try { await action.execute(item); await queryClient.invalidateQueries({ queryKey: [config.queryKey] }); toast.success(`${action.label} correctamente.`) } catch (error) { toast.error(getErrorMessage(error)) } finally { setRunningAction(null) } }}>{action.label}</Button>)}
        {canUpdate && <Button variant="ghost" size="icon" title="Editar" onClick={() => { setEditing(item); setFormError(null); setFormOpen(true) }}><Edit2 className="h-4 w-4" /></Button>}
        {canArchive && <Button variant="ghost" size="icon" title="Archivar" onClick={() => setRemoving(item)}><Trash2 className="h-4 w-4 text-danger" /></Button>}
      </div>
    ),
  })

  return (
    <div className="page-content">
      <PageHeader title={config.title} description={config.description} actions={canCreate && <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setFormError(null); setFormOpen(true) }}>Nuevo registro</Button>} />
      <form onSubmit={applyFilters}>
        <FilterBar>
          {(config.filterFields ?? []).map((field) => (
            field === 'status' ? (
              <Select key={field} value={draftFilters[field] ?? ''} onChange={(event) => setDraftFilters((current) => ({ ...current, [field]: event.target.value }))} className="max-w-[210px]">
                <option value="">Todos los estados</option>{(config.filterStatusOptions ?? [{ value: 'ACTIVE', label: 'Activos' }, { value: 'INACTIVE', label: 'Inactivos' }]).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            ) : <Input key={field} value={draftFilters[field] ?? ''} onChange={(event) => setDraftFilters((current) => ({ ...current, [field]: event.target.value }))} placeholder={`Filtrar por ${field}`} leading={<Search className="h-4 w-4" />} />
          ))}
          <Button type="submit" leftIcon={<Search className="h-4 w-4" />}>Buscar</Button>
          <Button type="button" variant="outline" onClick={() => { setDraftFilters({}); setFilterValues({}); setPage(1) }}>Limpiar</Button>
        </FilterBar>
      </form>
      {query.isError && <Alert variant="danger" title={`No se pudo cargar ${config.title.toLowerCase()}`} className="mb-5"><div className="flex flex-wrap items-center justify-between gap-3"><span>{getErrorMessage(query.error)}</span><Button variant="outline" size="sm" onClick={() => void query.refetch()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>Reintentar</Button></div></Alert>}
      <div className="panel-card overflow-hidden">
        <DataTable columns={columns} data={rows} keyExtractor={config.getId} loading={query.isLoading} emptyTitle={`No hay ${config.title.toLowerCase()}`} emptyDescription="Crea un registro o ajusta los filtros actuales." />
        {pagination?.type === 'OFFSET' && <Pagination page={pagination.page} pageCount={pageCount} total={pagination.totalItems} pageSize={pagination.limit} showTotal onChange={setPage} />}
      </div>
      <Modal open={formOpen} onClose={() => { if (!isSaving) { setFormOpen(false); setEditing(null) } }} title={editing ? `Editar ${config.title.toLowerCase()}` : `Nuevo ${config.title.toLowerCase()}`} size="lg" closeOnBackdrop={!isSaving} footer={<><Button variant="outline" onClick={() => { setFormOpen(false); setEditing(null) }} disabled={isSaving}>Cancelar</Button><Button type="submit" form="catalog-form" loading={isSaving}>{editing ? 'Guardar cambios' : 'Crear'}</Button></>}>
        {formOpen && <CatalogForm key={editing ? String(config.getId(editing)) : 'new'} config={config as unknown as CatalogCrudConfig<object>} values={getFormValues(editing)} loading={isSaving} serverError={formError} onSubmit={save} />}
      </Modal>
      <ConfirmDialog open={removing !== null} onClose={() => { if (!removeMutation.isPending) setRemoving(null) }} onConfirm={() => void remove()} loading={removeMutation.isPending} title={`¿Archivar ${config.title.toLowerCase()}?`} description="El registro dejará de estar activo y se conservará en el sistema." confirmText="Archivar" />
    </div>
  )
}
