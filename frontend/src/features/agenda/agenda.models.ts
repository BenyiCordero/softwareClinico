export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type ScheduleStatus = 'ACTIVE' | 'INACTIVE'
export interface Schedule { scheduleId: number; healthProfessionalId: number; branchId: number; consultingRoomId: number | null; name: string; slotDurationMinutes: number; status: ScheduleStatus }
export interface Appointment { appointmentId: number; patientId: number; scheduleId: number; healthProfessionalId: number; serviceId: number; branchId: number; consultingRoomId: number | null; startAt: string; endAt: string; status: AppointmentStatus; reasonForVisit: string | null; notes: string | null; priceAtBooking: string | null }
export interface ScheduleHour { scheduleHourId: number; scheduleId: number; dayOfWeek: string; startTime: string; endTime: string; validFrom: string; validUntil: string | null; status: string }
export interface AvailabilitySlot { startAt: string; endAt: string; scheduleId: number; available: boolean }
