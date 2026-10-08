export type PriceListStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
export type PriceDetailStatus = 'ACTIVE' | 'INACTIVE'
export type SpecialPriceStatus = 'PENDING' | 'APPROVED' | 'EXPIRED' | 'CANCELLED'
export interface PriceList { priceListId: number; name: string; description: string; branchId: number | null; patientCategoryId: number | null; currency: string; validFrom: string; validUntil: string | null; priority: number; status: PriceListStatus }
export interface PriceListDetail { priceListDetailId: number; serviceId: number; price: string; status: PriceDetailStatus }
export interface PatientSpecialPrice { patientSpecialPriceId: number; patientId: number; serviceId: number; branchId: number | null; price: string; validFrom: string; validUntil: string | null; reason: string | null; authorizedByUserId: number; status: SpecialPriceStatus }
