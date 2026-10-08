export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED'
export type HealthProfessionalStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
export type AssignmentType = 'PRIMARY' | 'SECONDARY' | 'TEMPORARY'
export type SpecialtyPriority = 'PRIMARY' | 'SECONDARY'
export type SchedulingType = 'APPOINTMENT' | 'WALK_IN' | 'BOTH'
export type ServiceStatus = 'ACTIVE' | 'TEMPORARILY_UNAVAILABLE' | 'DISCONTINUED'
export type RequirementLevel = 'MANDATORY' | 'OPTIONAL'

export interface Employee { employeeId: number; personId: number; employeeNumber: string; hireDate: string; terminationDate: string | null; status: EmployeeStatus }
export interface HealthProfessional { healthProfessionalId: number; employeeId: number; professionalLicense: string; specialtyLicense: string | null; bio: string | null; status: HealthProfessionalStatus }
export interface Service { serviceId: number; categoryId: number; code: string; name: string; description: string; durationMinutes: number; schedulingType: SchedulingType; status: ServiceStatus }
export interface EmployeeAssignment { employeeAssignmentId: number; branchId: number; areaId: number | null; positionId: number; assignmentType: AssignmentType; status: string; startDate: string; endDate: string | null }
export interface ProfessionalSpecialty { professionalSpecialtyId: number; specialtyId: number; priority: SpecialtyPriority }
export interface ServiceRequirement { serviceRequirementId: number; name: string; description: string; requirementLevel: RequirementLevel; sortOrder: number; status: string }
export interface ServiceAssignment { serviceAssignmentId: number; branchId: number; areaId: number | null; consultingRoomId: number | null; healthProfessionalId: number | null; status: string }
export interface ServiceCategory { serviceCategoryId: number; parentCategoryId: number | null; name: string; description: string; status: string }
