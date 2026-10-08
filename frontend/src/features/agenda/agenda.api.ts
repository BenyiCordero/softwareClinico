import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { Appointment, AvailabilitySlot, Schedule, ScheduleHour } from './agenda.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const agendaApi = {
  schedules: {
    list: (query: CatalogListQuery) => apiRequestPage<Schedule>({ method: 'GET', url: '/schedules', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<Schedule>({ method: 'POST', url: '/schedules', data: numeric(compact(input), 'healthProfessionalId', 'branchId', 'consultingRoomId', 'slotDurationMinutes') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<Schedule>({ method: 'PATCH', url: `/schedules/${id}`, data: numeric(compact(input), 'healthProfessionalId', 'branchId', 'consultingRoomId', 'slotDurationMinutes') }),
    remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/schedules/${id}` }),
    hours: (id: number) => apiRequest<ScheduleHour[]>({ method: 'GET', url: `/schedules/${id}/hours` }),
  },
  availability: (query: Record<string, unknown>) => apiRequest<AvailabilitySlot[]>({ method: 'GET', url: '/availability', params: query }),
  appointments: {
    list: (query: CatalogListQuery) => apiRequestPage<Appointment>({ method: 'GET', url: '/appointments', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<Appointment>({ method: 'POST', url: '/appointments', data: numeric(compact(input), 'patientId', 'scheduleId', 'healthProfessionalId', 'serviceId', 'branchId', 'consultingRoomId') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<Appointment>({ method: 'PATCH', url: `/appointments/${id}`, data: numeric(compact(input), 'scheduleId', 'healthProfessionalId', 'serviceId', 'branchId', 'consultingRoomId') }),
    remove: (id: number) => apiRequest<void>({ method: 'DELETE', url: `/appointments/${id}` }),
    transition: (id: number, action: string) => apiRequest<Appointment>({ method: 'POST', url: `/appointments/${id}/${action}` }),
  },
}
