import { PaymentMethodStatus } from "../../enum/payment-method-status.enum";

export class PaymentMethodResponseDto {
    paymentMethodId: number;
    name: string
    code: string;
    status: PaymentMethodStatus;
    createdAt: Date;
}