import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
export const patientSchema = z.object({ personId: positive, patientNumber: z.string().min(2), patientCategoryId: positive, bloodType: z.string().min(1), allergiesSummary: z.string(), status: z.string().min(1) })
export const emergencyContactSchema = z.object({ name: z.string().min(2), relationship: z.string().min(2), phone: z.string().min(7), secondaryPhone: z.string(), email: z.string().email('Correo inválido').or(z.literal('')), priority: z.string().min(1), status: z.string().min(1) })
