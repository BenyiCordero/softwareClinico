export type OrderStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED' | 'REFUNDED'
export type OrderDetailStatus = 'PENDING' | 'PROVIDED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
export interface Order { orderId: number; folio: string; patientId: number; appointmentId: number | null; consultationId: number | null; branchId: number; status: OrderStatus; subtotal: string; discount: string; tax: string; total: string; balance: string }
export interface OrderDetail { orderDetailId: number; serviceId: number; description: string; quantity: number; unitPrice: string; discount: string; tax: string; total: string; status: OrderDetailStatus }
export interface Payment { paymentId: number; orderId: number; paymentMethodId: number; amount: string; reference: string | null; status: PaymentStatus; paidAt: string; notes: string | null }
