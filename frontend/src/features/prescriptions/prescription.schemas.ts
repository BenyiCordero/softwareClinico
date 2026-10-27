import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
export const prescriptionSchema = z.object({ consultationId: positive, healthProfessionalId: positive, notes: z.string(), status: z.string().min(1) })
export const prescriptionItemSchema = z.object({ medication: z.string().min(2), presentation: z.string(), dose: z.string().min(1), route: z.string(), frequency: z.string().min(1), duration: z.string().min(1), instructions: z.string() })
