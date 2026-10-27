import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
export const clinicalRecordSchema = z.object({ patientId: positive, recordNumber: z.string().min(2), status: z.string().min(1) })
export const consultationSchema = z.object({ clinicalRecordId: positive, appointmentId: z.string(), healthProfessionalId: positive, branchId: positive, consultingRoomId: z.string(), serviceId: z.string(), reason: z.string().min(2), clinicalSummary: z.string() })
