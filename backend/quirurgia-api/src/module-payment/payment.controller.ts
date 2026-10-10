import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentController {
  constructor(private service: PaymentService) {}
  @Get() @RequirePermissions('payments.read') findAll() {
    return this.service.findAll();
  }
  @Get('order/:orderId') @RequirePermissions('payments.read') forOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.service.forOrder(orderId);
  }
  @Get(':id') @RequirePermissions('payments.read') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @Post() @RequirePermissions('payments.create') create(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    return this.service.create(dto, (req.user as { userId: number }).userId);
  }
  @Patch(':id') @RequirePermissions('payments.update') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.service.update(id, dto);
  }
}
