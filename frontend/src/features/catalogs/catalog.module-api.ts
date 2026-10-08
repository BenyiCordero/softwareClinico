import { archiveCatalog, createCatalog, listCatalog, updateCatalog } from './catalog.api'
import type { CatalogListQuery } from './catalog.types'
import type { Area, ConsultingRoom, PatientCategory, PaymentMethod, Person, Position, Specialty } from './catalog.models'

const compact = (values: Record<string, unknown>) => Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''))
const numeric = (value: string) => value ? Number(value) : null

export const peopleApi = {
  list: (query: CatalogListQuery) => listCatalog<Person>('/people', query),
  create: (input: Record<string, unknown>) => createCatalog<Person>('/people', compact(input)),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<Person>('/people', id, compact(input)),
  remove: (id: number) => archiveCatalog('/people', id),
}

export const areasApi = {
  list: (query: CatalogListQuery) => listCatalog<Area>('/areas', query),
  create: (input: Record<string, unknown>) => createCatalog<Area>('/areas', { ...compact(input), branchId: Number(input.branchId), parentAreaId: numeric(String(input.parentAreaId ?? '')) }),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<Area>('/areas', id, { ...compact(input), branchId: input.branchId ? Number(input.branchId) : undefined, parentAreaId: numeric(String(input.parentAreaId ?? '')) }),
  remove: (id: number) => archiveCatalog('/areas', id),
}

export const consultingRoomsApi = {
  list: (query: CatalogListQuery) => listCatalog<ConsultingRoom>('/consulting-rooms', query),
  create: (input: Record<string, unknown>) => createCatalog<ConsultingRoom>('/consulting-rooms', { ...compact(input), branchId: Number(input.branchId), areaId: numeric(String(input.areaId ?? '')) }),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<ConsultingRoom>('/consulting-rooms', id, { ...compact(input), branchId: input.branchId ? Number(input.branchId) : undefined, areaId: numeric(String(input.areaId ?? '')) }),
  remove: (id: number) => archiveCatalog('/consulting-rooms', id),
}

export const positionsApi = {
  list: (query: CatalogListQuery) => listCatalog<Position>('/positions', query),
  create: (input: Record<string, unknown>) => createCatalog<Position>('/positions', compact(input)),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<Position>('/positions', id, compact(input)),
  remove: (id: number) => archiveCatalog('/positions', id),
}

export const specialtiesApi = {
  list: (query: CatalogListQuery) => listCatalog<Specialty>('/specialties', query),
  create: (input: Record<string, unknown>) => createCatalog<Specialty>('/specialties', compact(input)),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<Specialty>('/specialties', id, compact(input)),
  remove: (id: number) => archiveCatalog('/specialties', id),
}

export const patientCategoriesApi = {
  list: (query: CatalogListQuery) => listCatalog<PatientCategory>('/patient-categories', query),
  create: (input: Record<string, unknown>) => createCatalog<PatientCategory>('/patient-categories', compact(input)),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<PatientCategory>('/patient-categories', id, compact(input)),
  remove: (id: number) => archiveCatalog('/patient-categories', id),
}

export const paymentMethodsApi = {
  list: (query: CatalogListQuery) => listCatalog<PaymentMethod>('/payment-method', query),
  create: (input: Record<string, unknown>) => createCatalog<PaymentMethod>('/payment-method', compact(input)),
  update: (id: number, input: Record<string, unknown>) => updateCatalog<PaymentMethod>('/payment-method', id, compact(input)),
  remove: (id: number) => archiveCatalog('/payment-method', id),
}
