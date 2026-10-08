import { z } from 'zod'
import type { BranchStatus } from './branch.types'

const branchStatusValues = ['ACTIVE', 'TEMPORARILY_CLOSED', 'INACTIVE'] as const satisfies readonly BranchStatus[]

export const branchFormSchema = z.object({
  code: z.string().trim().min(2, 'El código debe tener al menos 2 caracteres.').max(50),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100),
  phone: z.string().trim().min(7, 'El teléfono debe tener al menos 7 caracteres.').max(30),
  email: z.string().trim().email('Ingresa un correo válido.').max(254),
  address: z.string().trim().min(2).max(255),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(20),
  timezone: z.string().trim().min(2).max(100),
  status: z.enum(branchStatusValues).optional(),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>
