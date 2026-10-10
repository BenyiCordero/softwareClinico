import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CreateAppointmentDto, FindAppointmentQueryDto, RescheduleAppointmentDto, UpdateAppointmentNotesDto } from './dto';
import { AppointmentService } from './appointment.service';
import { AppointmentStatus } from './enum/appointment-status.enum';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}
  @RequirePermissions('appointments.read') @Get() findAll(@Query() query: FindAppointmentQueryDto) { return this.service.findAll(query); }
  @RequirePermissions('appointments.read') @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @RequirePermissions('appointments.create') @Post() create(@Body() dto: CreateAppointmentDto, @Req() req: Request) { return this.service.create(dto, (req.user as { userId: number }).userId); }
  @RequirePermissions('appointments.update') @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentNotesDto) { return this.service.update(id, dto); }
  @RequirePermissions('appointments.confirm') @Post(':id/confirm') confirm(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.CONFIRMED); }
  @RequirePermissions('appointments.check_in') @Post(':id/check-in') checkIn(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.CHECKED_IN); }
  @RequirePermissions('appointments.start') @Post(':id/start') start(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.IN_PROGRESS); }
  @RequirePermissions('appointments.complete') @Post(':id/complete') complete(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.COMPLETED); }
  @RequirePermissions('appointments.cancel') @Post(':id/cancel') cancel(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.CANCELLED); }
  @RequirePermissions('appointments.mark_no_show') @Post(':id/no-show') noShow(@Param('id', ParseIntPipe) id: number) { return this.service.transition(id, AppointmentStatus.NO_SHOW); }
  @RequirePermissions('appointments.reschedule') @Post(':id/reschedule') reschedule(@Param('id', ParseIntPipe) id: number, @Body() dto: RescheduleAppointmentDto, @Req() req: Request) { return this.service.reschedule(id, dto, (req.user as { userId: number }).userId); }
}
