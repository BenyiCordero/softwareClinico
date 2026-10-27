import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
const money = z.string().regex(/^\d{1,12}(\.\d{1,2})?$/, 'Usa un importe válido')
export const orderSchema = z.object({ patientId: positive, branchId: positive, appointmentId: z.string(), consultationId: z.string(), status: z.string().min(1) })
export const orderDetailSchema = z.object({ serviceId: positive, description: z.string().min(2), quantity: positive, unitPrice: money, discount: money, tax: money, status: z.string().min(1) })
export const paymentSchema = z.object({ paymentMethodId: positive, amount: money, reference: z.string(), notes: z.string() })
