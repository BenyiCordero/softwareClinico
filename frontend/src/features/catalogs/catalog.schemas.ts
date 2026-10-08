import { z } from 'zod'

const status = z.enum(['ACTIVE', 'INACTIVE'])
const requiredText = (label: string, min = 2, max = 255) => z.string().trim().min(min, `${label} es obligatorio.`).max(max)
const optionalText = (max = 255) => z.string().trim().max(max).optional().or(z.literal(''))
const optionalNumber = z.string().regex(/^$|^[1-9]\d*$/, 'Debe ser un número entero positivo.')

export const namedCatalogSchema = z.object({
  name: requiredText('El nombre', 2, 100),
  description: optionalText(),
  status,
})

export const paymentMethodSchema = namedCatalogSchema.extend({
  code: requiredText('El código', 2, 50),
})

export const areaSchema = z.object({
  branchId: z.string().regex(/^[1-9]\d*$/, 'La sucursal es obligatoria.'),
  parentAreaId: optionalNumber,
  name: requiredText('El nombre', 2, 100),
  description: optionalText(),
  status,
})

export const consultingRoomSchema = z.object({
  branchId: z.string().regex(/^[1-9]\d*$/, 'La sucursal es obligatoria.'),
  areaId: optionalNumber,
  code: requiredText('El código', 2, 50),
  name: requiredText('El nombre', 2, 100),
  floor: optionalText(50),
  description: optionalText(),
  status: z.enum(['AVAILABLE', 'MAINTENANCE', 'TEMPORARILY_UNAVAILABLE', 'INACTIVE']),
})

export const personSchema = z.object({
  firstName: requiredText('El nombre', 2, 100),
  middleName: optionalText(100),
  lastName: requiredText('El apellido', 2, 100),
  secondLastName: optionalText(100),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria.'),
  sex: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']),
  curp: z.string().trim().max(18).optional().or(z.literal('')),
  rfc: z.string().trim().max(13).optional().or(z.literal('')),
  phone: requiredText('El teléfono', 7, 30),
  secondaryPhone: optionalText(30),
  email: z.string().trim().email('Ingresa un correo válido.').optional().or(z.literal('')),
  address: optionalText(255),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalText(20),
})
