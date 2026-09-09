import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PaymentMethod } from "./entity/payment-method.entity";
import { RegisterPaymentMethodRequestDto } from "./dto/req/register-payment-method-request.dto";
import { PaymentMethodResponseDto } from "./dto/res/payment-method-response.dto";

@Injectable()
export class PaymentMethodService {
    constructor(
        private readonly paymentMethodRepository: Repository<PaymentMethod>
    ) {}

    async createPaymentMethod(dto: RegisterPaymentMethodRequestDto): PaymentMethodResponseDto {
        //here you implement your service, you can call the repository or investigate abt QueryBuilder to more complex consults.
    }
}