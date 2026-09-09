import { Controller, Post } from "@nestjs/common";
import { PaymentMethodService } from "./payment-method.service";
import { PaymentMethodResponseDto } from "./dto/res/payment-method-response.dto";

@Controller('payment-method')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) {}

    @Post()
    createPaymentMethod(dto: CreatePaymentMethodDto): PaymentMethodResponseDto {
        this.paymentMethodService.createPaymentMethod(dto); //Here it doesnt work yet, bc ive not implemented the service method, and i must to implement the pagination and the auth first, but if you do your services before i implement auth/pagination, just return it as normally
    }
}