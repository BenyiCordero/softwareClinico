import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { PrescriptionService } from './prescription.service';
import {
  CreatePrescriptionDto,
  CreatePrescriptionItemDto,
  UpdatePrescriptionDto,
} from './dto';
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PrescriptionController {
  constructor(private service: PrescriptionService) {}
  @Get() @RequirePermissions('prescriptions.read') findAll() {
    return this.service.findAll();
  }
  @Get(':id') @RequirePermissions('prescriptions.read') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @Post() @RequirePermissions('prescriptions.create') create(
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.service.create(dto);
  }
  @Patch(':id') @RequirePermissions('prescriptions.update') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.service.update(id, dto);
  }
  @Get(':id/items') @RequirePermissions('prescriptions.read') items(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.listItems(id);
  }
  @Post(':id/items') @RequirePermissions('prescriptions.update') addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePrescriptionItemDto,
  ) {
    return this.service.addItem(id, dto);
  }
  @Delete(':id/items/:itemId')
  @HttpCode(204)
  @RequirePermissions('prescriptions.update')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.removeItem(id, itemId);
  }
}
