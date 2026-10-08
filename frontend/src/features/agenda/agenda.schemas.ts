import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
export const scheduleSchema = z.object({ healthProfessionalId: positive, branchId: positive, consultingRoomId: z.string(), name: z.string().min(2), slotDurationMinutes: positive, status: z.string().min(1) })
export const appointmentSchema = z.object({ patientId: positive, scheduleId: positive, healthProfessionalId: positive, serviceId: positive, branchId: positive, consultingRoomId: z.string(), startAt: z.string().min(1), endAt: z.string().min(1), reasonForVisit: z.string(), notes: z.string() })
