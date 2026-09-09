import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Min, MinLength } from "class-validator";

export class RegisterPaymentMethodRequestDto {
    @IsString()
    @Length(2, 100)
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;

    @IsString()
    @Length(2, 50)
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    code: string;
}