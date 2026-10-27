import { apiRequest, apiRequestPage } from '@/infrastructure/http'
import type { CatalogListQuery } from '@/features/catalogs/catalog.types'
import type { Order, OrderDetail, Payment } from './billing.models'
const compact = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([, value]) => value !== '' && value !== null))
const numeric = (input: Record<string, unknown>, ...keys: string[]) => Object.fromEntries(Object.entries(input).map(([key, value]) => keys.includes(key) && value !== '' ? [key, Number(value)] : [key, value]))
export const billingApi = {
  orders: {
    list: (query: CatalogListQuery) => apiRequestPage<Order>({ method: 'GET', url: '/orders', params: query }),
    create: (input: Record<string, unknown>) => apiRequest<Order>({ method: 'POST', url: '/orders', data: numeric(compact(input), 'patientId', 'appointmentId', 'consultationId', 'branchId') }),
    update: (id: number, input: Record<string, unknown>) => apiRequest<Order>({ method: 'PATCH', url: `/orders/${id}`, data: compact(input) }),
    transition: (id: number, action: string) => apiRequest<Order>({ method: 'POST', url: `/orders/${id}/${action}` }),
    details: (id: number) => apiRequest<OrderDetail[]>({ method: 'GET', url: `/orders/${id}/details` }),
    createDetail: (id: number, input: Record<string, unknown>) => apiRequest<OrderDetail>({ method: 'POST', url: `/orders/${id}/details`, data: numeric(compact(input), 'serviceId', 'quantity') }),
    updateDetail: (id: number, detailId: number, input: Record<string, unknown>) => apiRequest<OrderDetail>({ method: 'PATCH', url: `/orders/${id}/details/${detailId}`, data: numeric(compact(input), 'quantity') }),
    removeDetail: (id: number, detailId: number) => apiRequest<void>({ method: 'DELETE', url: `/orders/${id}/details/${detailId}` }),
    payments: (id: number) => apiRequest<Payment[]>({ method: 'GET', url: `/payments/order/${id}` }),
    createPayment: (id: number, input: Record<string, unknown>) => apiRequest<Payment>({ method: 'POST', url: '/payments', data: numeric(compact({ orderId: id, ...input }), 'orderId', 'paymentMethodId') }),
    updatePayment: (_id: number, paymentId: number, input: Record<string, unknown>) => apiRequest<Payment>({ method: 'PATCH', url: `/payments/${paymentId}`, data: compact(input) }),
    transitionPayment: (_id: number, paymentId: number, action: string) => { void action; return apiRequest<Payment>({ method: 'PATCH', url: `/payments/${paymentId}`, data: {} }) },
  },
}
