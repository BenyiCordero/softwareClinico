import { z } from 'zod'

const requiredNumber = z.string().min(1, 'Ingresa un número').refine((value) => Number(value) > 0, 'Debe ser mayor que cero')
const optionalNumber = z.string().refine((value) => value === '' || Number(value) > 0, 'Debe ser mayor que cero')
const status = z.string().min(1, 'Selecciona un estado')

export const employeeSchema = z.object({ personId: requiredNumber, employeeNumber: z.string().min(2), hireDate: z.string().min(1), status })
export const professionalSchema = z.object({ employeeId: requiredNumber, professionalLicense: z.string().min(2), specialtyLicense: z.string(), bio: z.string(), status })
export const serviceSchema = z.object({ categoryId: requiredNumber, code: z.string().min(2), name: z.string().min(2), description: z.string().min(2), durationMinutes: requiredNumber, schedulingType: z.string().min(1), status })
export const assignmentSchema = z.object({ branchId: requiredNumber, areaId: optionalNumber, positionId: requiredNumber, assignmentType: z.string().min(1), startDate: z.string().min(1) })
export const professionalSpecialtySchema = z.object({ specialtyId: requiredNumber, priority: z.string().min(1) })
export const requirementSchema = z.object({ name: z.string().min(2), description: z.string().min(2), requirementLevel: z.string().min(1), sortOrder: z.string().refine((value) => Number(value) >= 0, 'Debe ser cero o mayor'), status })
export const serviceAssignmentSchema = z.object({ branchId: requiredNumber, areaId: optionalNumber, consultingRoomId: optionalNumber, healthProfessionalId: optionalNumber, status })
export const serviceCategorySchema = z.object({ parentCategoryId: optionalNumber, name: z.string().min(2), description: z.string().min(2), status })
