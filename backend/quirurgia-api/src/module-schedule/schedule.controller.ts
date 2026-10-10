import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  AvailabilityQueryDto,
  CreateScheduleBlockDto,
  CreateScheduleDto,
  CreateScheduleHourDto,
  FindScheduleQueryDto,
  UpdateScheduleDto,
  UpdateScheduleHourDto,
} from './dto';
import { ScheduleService } from './schedule.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}
  @RequirePermissions('schedules.read') @Get() findAll(
    @Query() query: FindScheduleQueryDto,
  ) {
    return this.service.findAll(query);
  }
  @RequirePermissions('schedules.read') @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @RequirePermissions('schedules.create') @Post() create(
    @Body() dto: CreateScheduleDto,
  ) {
    return this.service.create(dto);
  }
  @RequirePermissions('schedules.update') @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.service.update(id, dto);
  }
  @RequirePermissions('schedules.read') @Get(':id/hours') hours(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.listHours(id);
  }
  @RequirePermissions('schedules.update') @Post(':id/hours') addHour(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateScheduleHourDto,
  ) {
    return this.service.addHour(id, dto);
  }
  @RequirePermissions('schedules.update')
  @Patch(':id/hours/:hourId')
  updateHour(
    @Param('id', ParseIntPipe) id: number,
    @Param('hourId', ParseIntPipe) hourId: number,
    @Body() dto: UpdateScheduleHourDto,
  ) {
    return this.service.updateHour(id, hourId, dto);
  }
  @RequirePermissions('schedules.read') @Get(':id/blocks') blocks(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.listBlocks(id);
  }
  @RequirePermissions('schedules.block') @Post(':id/blocks') addBlock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateScheduleBlockDto,
    @Req() req: Request,
  ) {
    return this.service.addBlock(
      id,
      (req.user as { userId: number }).userId,
      dto,
    );
  }
  @RequirePermissions('schedules.read') @Get(':id/availability') availability(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.service.availability(id, query.date);
  }
}
