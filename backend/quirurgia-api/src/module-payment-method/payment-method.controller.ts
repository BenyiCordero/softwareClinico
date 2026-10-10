import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePaymentMethodDto } from './dto/request/create-payment-method.dto';
import { FindPaymentMethodQueryDto } from './dto/request/find-payment-method-query.dto';
import { UpdatePaymentMethodDto } from './dto/request/update-payment-method.dto';
import { PaymentMethodResponseDto } from './dto/res/payment-method-response.dto';
import { PaymentMethodService } from './payment-method.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @RequirePermissions('payment-methods.read')
  @Get()
  findAll(
    @Query() query?: FindPaymentMethodQueryDto,
  ): Promise<OffsetPaginatedResult<PaymentMethodResponseDto>> {
    return this.paymentMethodService.findAll(query);
  }

  @RequirePermissions('payment-methods.read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.findOne(id);
  }

  @RequirePermissions('payment-methods.create')
  @Post()
  create(
    @Body() dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.create(dto);
  }

  @RequirePermissions('payment-methods.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.update(id, dto);
  }

  @RequirePermissions('payment-methods.delete')
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.paymentMethodService.remove(id);
  }
}
