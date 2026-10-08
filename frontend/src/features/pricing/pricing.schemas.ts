import { z } from 'zod'
const positive = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
const optional = z.string().refine((value) => value === '' || Number(value) > 0, 'Debe ser mayor que cero')
const money = z.string().regex(/^\d{1,12}(\.\d{1,2})?$/, 'Usa un importe con hasta dos decimales')
export const priceListSchema = z.object({ name: z.string().min(2), description: z.string().min(2), branchId: optional, patientCategoryId: optional, currency: z.string().length(3), validFrom: z.string().min(1), validUntil: z.string(), priority: z.string().refine((value) => Number(value) >= 0) })
export const specialPriceSchema = z.object({ patientId: positive, serviceId: positive, branchId: optional, price: money, validFrom: z.string().min(1), validUntil: z.string(), reason: z.string() })
