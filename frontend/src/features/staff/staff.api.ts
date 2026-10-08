import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { Employee, EmployeeAssignment, HealthProfessional, ProfessionalSpecialty, Service, ServiceAssignment, ServiceCategory, ServiceRequirement } from './staff.models'

const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
const list = <T>(url: string, query: CatalogListQuery) => apiRequestPage<T>({ method: 'GET', url, params: query })
const create = <T>(url: string, input: Record<string, unknown>) => apiRequest<T>({ method: 'POST', url, data: input })
const update = <T>(url: string, id: number, input: Record<string, unknown>) => apiRequest<T>({ method: 'PATCH', url: `${url}/${id}`, data: input })
const remove = (url: string, id: number) => apiRequest<void>({ method: 'DELETE', url: `${url}/${id}` })

export const employeesApi = {
  list: (query: CatalogListQuery) => list<Employee>('/employees', query),
  create: (input: Record<string, unknown>) => create<Employee>('/employees', numeric(compact(input), 'personId')),
  update: (id: number, input: Record<string, unknown>) => update<Employee>('/employees', id, compact(input)),
  remove: (id: number) => remove('/employees', id),
  assignments: (id: number) => apiRequest<EmployeeAssignment[]>({ method: 'GET', url: `/employees/${id}/assignments` }),
  assign: (id: number, input: Record<string, unknown>) => create<EmployeeAssignment>(`/employees/${id}/assignments`, numeric(compact(input), 'branchId', 'areaId', 'positionId')),
  endAssignment: (id: number, assignmentId: number, input: Record<string, unknown>) => apiRequest<void>({ method: 'PATCH', url: `/employees/${id}/assignments/${assignmentId}/end`, data: compact(input) }),
}

export const healthProfessionalsApi = {
  list: (query: CatalogListQuery) => list<HealthProfessional>('/health-professionals', query),
  create: (input: Record<string, unknown>) => create<HealthProfessional>('/health-professionals', numeric(compact(input), 'employeeId')),
  update: (id: number, input: Record<string, unknown>) => update<HealthProfessional>('/health-professionals', id, compact(input)),
  remove: (id: number) => remove('/health-professionals', id),
  specialties: (id: number) => apiRequest<ProfessionalSpecialty[]>({ method: 'GET', url: `/health-professionals/${id}/specialties` }),
  assignSpecialty: (id: number, input: Record<string, unknown>) => create<ProfessionalSpecialty>(`/health-professionals/${id}/specialties`, numeric(input, 'specialtyId')),
  removeSpecialty: (id: number, specialtyId: number) => remove(`/health-professionals/${id}/specialties`, specialtyId),
}

export const servicesApi = {
  list: (query: CatalogListQuery) => list<Service>('/services', query),
  create: (input: Record<string, unknown>) => create<Service>('/services', numeric(compact(input), 'categoryId', 'durationMinutes')),
  update: (id: number, input: Record<string, unknown>) => update<Service>('/services', id, numeric(compact(input), 'categoryId', 'durationMinutes')),
  remove: (id: number) => remove('/services', id),
  requirements: (id: number) => apiRequest<ServiceRequirement[]>({ method: 'GET', url: `/services/${id}/requirements` }),
  createRequirement: (id: number, input: Record<string, unknown>) => create<ServiceRequirement>(`/services/${id}/requirements`, numeric(compact(input), 'sortOrder')),
  updateRequirement: (id: number, requirementId: number, input: Record<string, unknown>) => update<ServiceRequirement>(`/services/${id}/requirements`, requirementId, numeric(compact(input), 'sortOrder')),
  assignments: (id: number) => apiRequest<ServiceAssignment[]>({ method: 'GET', url: `/services/${id}/assignments` }),
  assign: (id: number, input: Record<string, unknown>) => create<ServiceAssignment>(`/services/${id}/assignments`, numeric(compact(input), 'branchId', 'areaId', 'consultingRoomId', 'healthProfessionalId')),
  updateAssignment: (id: number, assignmentId: number, input: Record<string, unknown>) => update<ServiceAssignment>(`/services/${id}/assignments`, assignmentId, numeric(compact(input), 'branchId', 'areaId', 'consultingRoomId', 'healthProfessionalId')),
  removeAssignment: (id: number, assignmentId: number) => remove(`/services/${id}/assignments`, assignmentId),
}

export const serviceCategoriesApi = {
  list: (query: CatalogListQuery) => list<ServiceCategory>('/service-categories', query),
  create: (input: Record<string, unknown>) => create<ServiceCategory>('/service-categories', numeric(compact(input), 'parentCategoryId')),
  update: (id: number, input: Record<string, unknown>) => update<ServiceCategory>('/service-categories', id, numeric(compact(input), 'parentCategoryId')),
  remove: (id: number) => remove('/service-categories', id),
}
