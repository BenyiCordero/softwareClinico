import CatalogCrudPage, { type CatalogCrudConfig } from '@/features/catalogs/CatalogCrudPage'
import { areaSchema, consultingRoomSchema, namedCatalogSchema, paymentMethodSchema, personSchema } from '@/features/catalogs/catalog.schemas'
import { areasApi, consultingRoomsApi, patientCategoriesApi, paymentMethodsApi, peopleApi, positionsApi, specialtiesApi } from '@/features/catalogs/catalog.module-api'
import type { Area, ConsultingRoom, PatientCategory, PaymentMethod, Person, Position, Specialty } from '@/features/catalogs/catalog.models'
import type { NamedCatalogItem } from '@/features/catalogs/catalog.types'

const textCell = (item: object, field: string) => String((item as Record<string, unknown>)[field] ?? '-')
const namedFields = [
  { name: 'name', label: 'Nombre', required: true },
  { name: 'description', label: 'Descripción' },
  { name: 'status', label: 'Estado', required: true, options: [{ value: 'ACTIVE', label: 'Activo' }, { value: 'INACTIVE', label: 'Inactivo' }] },
]
const namedDefaults = { name: '', description: '', status: 'ACTIVE' }

const namedConfig = <TItem extends NamedCatalogItem>(config: Omit<CatalogCrudConfig<TItem>, 'fields' | 'schema' | 'defaultValues'>): CatalogCrudConfig<TItem> => ({
  ...config,
  fields: namedFields,
  schema: namedCatalogSchema,
  defaultValues: namedDefaults,
})

const positionsConfig = namedConfig<Position>({
  queryKey: 'positions', title: 'Puestos', description: 'Administra los puestos laborales de la organización.', endpoint: '/positions', idField: 'positionId', filterFields: ['name', 'status'],
  permissions: { read: 'positions.read', create: 'positions.create', update: 'positions.update', archive: 'positions.archive' },
  list: positionsApi.list, create: positionsApi.create, update: positionsApi.update, remove: positionsApi.remove, getId: (item) => item.positionId, getCell: textCell,
})

const specialtiesConfig = namedConfig<Specialty>({
  queryKey: 'specialties', title: 'Especialidades', description: 'Administra las especialidades disponibles para profesionales.', endpoint: '/specialties', idField: 'specialtyId', filterFields: ['name', 'status'],
  permissions: { read: 'specialties.read', create: 'specialties.create', update: 'specialties.update', archive: 'specialties.archive' },
  list: specialtiesApi.list, create: specialtiesApi.create, update: specialtiesApi.update, remove: specialtiesApi.remove, getId: (item) => item.specialtyId, getCell: textCell,
})

const patientCategoriesConfig = namedConfig<PatientCategory>({
  queryKey: 'patient-categories', title: 'Categorías de pacientes', description: 'Administra categorías comerciales y de atención.', endpoint: '/patient-categories', idField: 'patientCategoryId', filterFields: ['name', 'status'],
  permissions: { read: 'patient-categories.read', create: 'patient-categories.create', update: 'patient-categories.update', archive: 'patient-categories.archive' },
  list: patientCategoriesApi.list, create: patientCategoriesApi.create, update: patientCategoriesApi.update, remove: patientCategoriesApi.remove, getId: (item) => item.patientCategoryId, getCell: textCell,
})

const paymentMethodsConfig: CatalogCrudConfig<PaymentMethod> = {
  queryKey: 'payment-methods', title: 'Métodos de pago', description: 'Administra las formas de pago disponibles.', endpoint: '/payment-method', idField: 'paymentMethodId', filterFields: ['name', 'code', 'status'],
  fields: [{ name: 'name', label: 'Nombre', required: true }, { name: 'code', label: 'Código', required: true }, ...namedFields.slice(2)],
  schema: paymentMethodSchema, defaultValues: { name: '', code: '', status: 'ACTIVE' },
  permissions: { read: 'payment-methods.read', create: 'payment-methods.create', update: 'payment-methods.update', archive: 'payment-methods.delete' },
  list: paymentMethodsApi.list, create: paymentMethodsApi.create, update: paymentMethodsApi.update, remove: paymentMethodsApi.remove, getId: (item) => item.paymentMethodId, getCell: textCell,
}

const areaConfig: CatalogCrudConfig<Area> = {
  queryKey: 'areas', title: 'Áreas', description: 'Administra las áreas jerárquicas de cada sucursal.', endpoint: '/areas', idField: 'areaId', filterFields: ['name', 'branchId', 'parentAreaId', 'status'],
  fields: [
    { name: 'branchId', label: 'ID de sucursal', required: true, type: 'number' },
    { name: 'parentAreaId', label: 'ID de área padre', type: 'number' },
    { name: 'name', label: 'Nombre', required: true },
    { name: 'description', label: 'Descripción' },
    { name: 'status', label: 'Estado', required: true, options: [{ value: 'ACTIVE', label: 'Activo' }, { value: 'INACTIVE', label: 'Inactivo' }] },
  ],
  schema: areaSchema, defaultValues: { branchId: '', parentAreaId: '', name: '', description: '', status: 'ACTIVE' },
  permissions: { read: 'areas.read', create: 'areas.create', update: 'areas.update', archive: 'areas.archive' },
  list: areasApi.list, create: areasApi.create, update: areasApi.update, remove: areasApi.remove, getId: (item) => item.areaId, getCell: textCell,
}

const consultingRoomConfig: CatalogCrudConfig<ConsultingRoom> = {
  queryKey: 'consulting-rooms', title: 'Consultorios', description: 'Administra los consultorios físicos de cada sucursal.', endpoint: '/consulting-rooms', idField: 'consultingRoomId', filterFields: ['code', 'name', 'branchId', 'areaId', 'status'],
  fields: [
    { name: 'branchId', label: 'ID de sucursal', required: true, type: 'number' },
    { name: 'areaId', label: 'ID de área', type: 'number' },
    { name: 'code', label: 'Código', required: true },
    { name: 'name', label: 'Nombre', required: true },
    { name: 'floor', label: 'Piso' },
    { name: 'description', label: 'Descripción' },
    { name: 'status', label: 'Estado', required: true, options: [
      { value: 'AVAILABLE', label: 'Disponible' }, { value: 'MAINTENANCE', label: 'Mantenimiento' },
      { value: 'TEMPORARILY_UNAVAILABLE', label: 'No disponible temporalmente' }, { value: 'INACTIVE', label: 'Inactivo' },
    ] },
  ],
  schema: consultingRoomSchema, defaultValues: { branchId: '', areaId: '', code: '', name: '', floor: '', description: '', status: 'AVAILABLE' },
  permissions: { read: 'consulting-rooms.read', create: 'consulting-rooms.create', update: 'consulting-rooms.update', archive: 'consulting-rooms.archive' },
  list: consultingRoomsApi.list, create: consultingRoomsApi.create, update: consultingRoomsApi.update, remove: consultingRoomsApi.remove, getId: (item) => item.consultingRoomId, getCell: textCell,
}

const personFields = [
  { name: 'firstName', label: 'Nombre', required: true }, { name: 'middleName', label: 'Segundo nombre' },
  { name: 'lastName', label: 'Primer apellido', required: true }, { name: 'secondLastName', label: 'Segundo apellido' },
  { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date' as const, required: true },
  { name: 'sex', label: 'Sexo', required: true, options: [{ value: 'MALE', label: 'Masculino' }, { value: 'FEMALE', label: 'Femenino' }, { value: 'UNSPECIFIED', label: 'No especificado' }] },
  { name: 'curp', label: 'CURP' }, { name: 'rfc', label: 'RFC' }, { name: 'phone', label: 'Teléfono', required: true },
  { name: 'secondaryPhone', label: 'Teléfono secundario' }, { name: 'email', label: 'Correo', type: 'email' as const },
  { name: 'address', label: 'Dirección' }, { name: 'city', label: 'Ciudad' }, { name: 'state', label: 'Estado' }, { name: 'postalCode', label: 'Código postal' },
]
const personConfig: CatalogCrudConfig<Person> = {
  queryKey: 'people', title: 'Personas', description: 'Administra los datos base de las personas del sistema.', endpoint: '/people', idField: 'personId', filterFields: ['name', 'email', 'phone', 'curp', 'rfc'],
  fields: personFields, schema: personSchema,
  defaultValues: { firstName: '', middleName: '', lastName: '', secondLastName: '', birthDate: '', sex: 'UNSPECIFIED', curp: '', rfc: '', phone: '', secondaryPhone: '', email: '', address: '', city: '', state: '', postalCode: '' },
  permissions: { read: 'people.read', create: 'people.create', update: 'people.update', archive: 'people.archive' },
  list: peopleApi.list, create: peopleApi.create, update: peopleApi.update, remove: peopleApi.remove, getId: (item) => item.personId, getCell: textCell,
}

export function PeoplePage() { return <CatalogCrudPage config={personConfig} /> }
export function AreasPage() { return <CatalogCrudPage config={areaConfig} /> }
export function ConsultingRoomsPage() { return <CatalogCrudPage config={consultingRoomConfig} /> }
export function PositionsPage() { return <CatalogCrudPage config={positionsConfig} /> }
export function SpecialtiesPage() { return <CatalogCrudPage config={specialtiesConfig} /> }
export function PatientCategoriesPage() { return <CatalogCrudPage config={patientCategoriesConfig} /> }
export function PaymentMethodsPage() { return <CatalogCrudPage config={paymentMethodsConfig} /> }
