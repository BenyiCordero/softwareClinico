import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { OrderService } from './order.service';
import {
  CreateOrderDetailDto,
  CreateOrderDto,
  UpdateOrderDetailDto,
  UpdateOrderDto,
} from './dto';
@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrderController {
  constructor(private service: OrderService) {}
  @Get() @RequirePermissions('orders.read') findAll() {
    return this.service.findAll();
  }
  @Get(':id') @RequirePermissions('orders.read') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @Post() @RequirePermissions('orders.create') create(
    @Body() dto: CreateOrderDto,
    @Req() req: Request,
  ) {
    return this.service.create(dto, (req.user as { userId: number }).userId);
  }
  @Patch(':id') @RequirePermissions('orders.update') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.service.update(id, dto);
  }
  @Get(':id/details') @RequirePermissions('orders.read') details(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.listDetails(id);
  }
  @Post(':id/details') @RequirePermissions('orders.update') addDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateOrderDetailDto,
  ) {
    return this.service.addDetail(id, dto);
  }
  @Patch(':id/details/:detailId')
  @RequirePermissions('orders.update')
  updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() dto: UpdateOrderDetailDto,
  ) {
    return this.service.updateDetail(id, detailId, dto);
  }
  @Delete(':id/details/:detailId')
  @HttpCode(204)
  @RequirePermissions('orders.update')
  removeDetail(
    @Param('id', ParseIntPipe) id: number,
    @Param('detailId', ParseIntPipe) detailId: number,
  ) {
    return this.service.removeDetail(id, detailId);
  }
}
