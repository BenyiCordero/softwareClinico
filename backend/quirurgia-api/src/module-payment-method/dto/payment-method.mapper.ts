import { PaymentMethodResponseDto } from "./res/payment-method-response.dto";

export class PaymentMethodMapper {
    static toResponseDto(paymentMethod: any): PaymentMethodResponseDto {
        return {
            paymentMethodId: paymentMethod.id,
            name: paymentMethod.name,
            code: paymentMethod.code,
            status: paymentMethod.status,
            createdAt: paymentMethod.createdAt
        }
    }
}