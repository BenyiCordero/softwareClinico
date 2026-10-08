import CatalogCrudPage, { type CatalogCrudConfig } from '@/features/catalogs/CatalogCrudPage'
import { patientsApi } from '@/features/patients/patient.api'
import { patientSchema } from '@/features/patients/patient.schemas'
import type { Patient } from '@/features/patients/patient.models'
const cell = (item: object, field: string) => String((item as Record<string, unknown>)[field] ?? '-')
const statusOptions = [{ value: 'ACTIVE', label: 'Activo' }, { value: 'INACTIVE', label: 'Inactivo' }, { value: 'DECEASED', label: 'Fallecido' }, { value: 'BLOCKED', label: 'Bloqueado' }]
const patientConfig: CatalogCrudConfig<Patient> = {
  queryKey: 'patients', title: 'Pacientes', description: 'Administra pacientes, estado clínico y datos de atención.', endpoint: '/patients', idField: 'patientId', filterFields: ['name', 'status'], filterStatusOptions: statusOptions,
  fields: [{ name: 'personId', label: 'ID de persona', required: true, type: 'number' }, { name: 'patientNumber', label: 'Número de paciente', required: true }, { name: 'patientCategoryId', label: 'ID de categoría', required: true, type: 'number' }, { name: 'bloodType', label: 'Tipo sanguíneo', required: true, options: [{ value: 'A_POSITIVE', label: 'A+' }, { value: 'A_NEGATIVE', label: 'A-' }, { value: 'B_POSITIVE', label: 'B+' }, { value: 'B_NEGATIVE', label: 'B-' }, { value: 'AB_POSITIVE', label: 'AB+' }, { value: 'AB_NEGATIVE', label: 'AB-' }, { value: 'O_POSITIVE', label: 'O+' }, { value: 'O_NEGATIVE', label: 'O-' }, { value: 'UNKNOWN', label: 'Desconocido' }] }, { name: 'allergiesSummary', label: 'Alergias' }, { name: 'status', label: 'Estado', required: true, options: statusOptions }],
  schema: patientSchema, defaultValues: { personId: '', patientNumber: '', patientCategoryId: '', bloodType: 'UNKNOWN', allergiesSummary: '', status: 'ACTIVE' }, permissions: { read: 'patients.read', create: 'patients.create', update: 'patients.update', archive: 'patients.archive' }, list: patientsApi.list, create: patientsApi.create, update: patientsApi.update, remove: patientsApi.remove, getId: (item) => item.patientId, getCell: cell, detailPath: (item) => `/dashboard/patients/${item.patientId}`,
  toCreateInput: (values) => ({ ...values, personId: Number(values.personId), patientCategoryId: Number(values.patientCategoryId) }), toUpdateInput: (values) => ({ ...values, patientCategoryId: Number(values.patientCategoryId) }),
}
export default function PatientsPage() { return <CatalogCrudPage config={patientConfig} /> }
