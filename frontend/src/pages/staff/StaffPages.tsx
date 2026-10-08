import CatalogCrudPage, { type CatalogCrudConfig } from '@/features/catalogs/CatalogCrudPage'
import { employeeSchema, professionalSchema, serviceCategorySchema, serviceSchema } from '@/features/staff/staff.schemas'
import { employeesApi, healthProfessionalsApi, serviceCategoriesApi, servicesApi } from '@/features/staff/staff.api'
import type { Employee, HealthProfessional, Service, ServiceCategory } from '@/features/staff/staff.models'

const cell = (item: object, field: string) => String((item as Record<string, unknown>)[field] ?? '-')
const statusOptions = (values: Array<[string, string]>) => values.map(([value, label]) => ({ value, label }))

const employeeConfig: CatalogCrudConfig<Employee> = {
  queryKey: 'employees', title: 'Empleados', description: 'Administra el personal laboral y sus estados.', endpoint: '/employees', idField: 'employeeId', filterFields: ['name', 'status'],
  fields: [
    { name: 'personId', label: 'ID de persona', required: true, type: 'number' },
    { name: 'employeeNumber', label: 'Número de empleado', required: true },
    { name: 'hireDate', label: 'Fecha de ingreso', required: true, type: 'date' },
    { name: 'status', label: 'Estado', required: true, options: statusOptions([['ACTIVE', 'Activo'], ['ON_LEAVE', 'En licencia'], ['SUSPENDED', 'Suspendido'], ['TERMINATED', 'Terminado']]) },
  ],
  schema: employeeSchema, defaultValues: { personId: '', employeeNumber: '', hireDate: '', status: 'ACTIVE' },
  permissions: { read: 'employees.read', create: 'employees.create', update: 'employees.update', archive: 'employees.archive' },
  list: employeesApi.list, create: employeesApi.create, update: employeesApi.update, remove: employeesApi.remove, getId: (item) => item.employeeId, getCell: cell,
  toCreateInput: (values) => ({ ...values, personId: Number(values.personId) }),
  detailPath: (item) => `/dashboard/employees/${item.employeeId}/assignments`,
}

const professionalConfig: CatalogCrudConfig<HealthProfessional> = {
  queryKey: 'health-professionals', title: 'Profesionales de salud', description: 'Administra licencias y perfiles de profesionales.', endpoint: '/health-professionals', idField: 'healthProfessionalId', filterFields: ['name', 'status'],
  fields: [
    { name: 'employeeId', label: 'ID de empleado', required: true, type: 'number' },
    { name: 'professionalLicense', label: 'Cédula profesional', required: true },
    { name: 'specialtyLicense', label: 'Cédula de especialidad' },
    { name: 'bio', label: 'Biografía' },
    { name: 'status', label: 'Estado', required: true, options: statusOptions([['ACTIVE', 'Activo'], ['SUSPENDED', 'Suspendido'], ['INACTIVE', 'Inactivo']]) },
  ],
  schema: professionalSchema, defaultValues: { employeeId: '', professionalLicense: '', specialtyLicense: '', bio: '', status: 'ACTIVE' },
  permissions: { read: 'health-professionals.read', create: 'health-professionals.create', update: 'health-professionals.update', archive: 'health-professionals.archive' },
  list: healthProfessionalsApi.list, create: healthProfessionalsApi.create, update: healthProfessionalsApi.update, remove: healthProfessionalsApi.remove, getId: (item) => item.healthProfessionalId, getCell: cell,
  toCreateInput: (values) => ({ ...values, employeeId: Number(values.employeeId) }),
  detailPath: (item) => `/dashboard/health-professionals/${item.healthProfessionalId}/specialties`,
}

const serviceConfig: CatalogCrudConfig<Service> = {
  queryKey: 'services', title: 'Servicios', description: 'Administra los servicios clínicos programables.', endpoint: '/services', idField: 'serviceId', filterFields: ['code', 'name', 'status'],
  fields: [
    { name: 'categoryId', label: 'ID de categoría', required: true, type: 'number' },
    { name: 'code', label: 'Código', required: true },
    { name: 'name', label: 'Nombre', required: true },
    { name: 'description', label: 'Descripción', required: true },
    { name: 'durationMinutes', label: 'Duración (minutos)', required: true, type: 'number' },
    { name: 'schedulingType', label: 'Tipo de agenda', required: true, options: statusOptions([['APPOINTMENT', 'Cita'], ['WALK_IN', 'Sin cita'], ['BOTH', 'Cita y sin cita']]) },
    { name: 'status', label: 'Estado', required: true, options: statusOptions([['ACTIVE', 'Activo'], ['TEMPORARILY_UNAVAILABLE', 'No disponible temporalmente'], ['DISCONTINUED', 'Descontinuado']]) },
  ],
  schema: serviceSchema, defaultValues: { categoryId: '', code: '', name: '', description: '', durationMinutes: '', schedulingType: 'APPOINTMENT', status: 'ACTIVE' },
  permissions: { read: 'services.read', create: 'services.create', update: 'services.update', archive: 'services.archive' },
  list: servicesApi.list, create: servicesApi.create, update: servicesApi.update, remove: servicesApi.remove, getId: (item) => item.serviceId, getCell: cell,
  toCreateInput: (values) => ({ ...values, categoryId: Number(values.categoryId), durationMinutes: Number(values.durationMinutes) }),
  toUpdateInput: (values) => ({ ...values, categoryId: Number(values.categoryId), durationMinutes: Number(values.durationMinutes) }),
  detailPath: (item) => `/dashboard/services/${item.serviceId}/relationships`,
}

const serviceCategoryConfig: CatalogCrudConfig<ServiceCategory> = {
  queryKey: 'service-categories', title: 'Categorías de servicios', description: 'Organiza los servicios clínicos por categorías.', endpoint: '/service-categories', idField: 'serviceCategoryId', filterFields: ['name', 'status'],
  fields: [{ name: 'parentCategoryId', label: 'ID de categoría padre', type: 'number' }, { name: 'name', label: 'Nombre', required: true }, { name: 'description', label: 'Descripción', required: true }, { name: 'status', label: 'Estado', required: true, options: statusOptions([['ACTIVE', 'Activo'], ['INACTIVE', 'Inactivo']]) }],
  schema: serviceCategorySchema, defaultValues: { parentCategoryId: '', name: '', description: '', status: 'ACTIVE' },
  permissions: { read: 'service-categories.read', create: 'service-categories.create', update: 'service-categories.update', archive: 'service-categories.archive' },
  list: serviceCategoriesApi.list, create: serviceCategoriesApi.create, update: serviceCategoriesApi.update, remove: serviceCategoriesApi.remove, getId: (item) => item.serviceCategoryId, getCell: cell,
  toCreateInput: (values) => ({ ...values, parentCategoryId: values.parentCategoryId ? Number(values.parentCategoryId) : undefined }),
}

export function EmployeesPage() { return <CatalogCrudPage config={employeeConfig} /> }
export function HealthProfessionalsPage() { return <CatalogCrudPage config={professionalConfig} /> }
export function ServicesPage() { return <CatalogCrudPage config={serviceConfig} /> }
export function ServiceCategoriesPage() { return <CatalogCrudPage config={serviceCategoryConfig} /> }
