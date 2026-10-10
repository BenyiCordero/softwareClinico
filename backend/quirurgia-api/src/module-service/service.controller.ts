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
import { CreateServiceAssignmentDto } from './dto/request/create-service-assignment.dto';
import { CreateServiceRequirementDto } from './dto/request/create-service-requirement.dto';
import { CreateServiceDto } from './dto/request/create-service.dto';
import { FindServiceQueryDto } from './dto/request/find-service-query.dto';
import { UpdateServiceAssignmentDto } from './dto/request/update-service-assignment.dto';
import { UpdateServiceRequirementDto } from './dto/request/update-service-requirement.dto';
import { UpdateServiceDto } from './dto/request/update-service.dto';
import { ServiceAssignmentResponseDto } from './dto/response/service-assignment-response.dto';
import { ServiceRequirementResponseDto } from './dto/response/service-requirement-response.dto';
import { ServiceResponseDto } from './dto/response/service-response.dto';
import { ServiceService } from './service.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @RequirePermissions('services.read')
  @Get()
  findAll(
    @Query() query?: FindServiceQueryDto,
  ): Promise<OffsetPaginatedResult<ServiceResponseDto>> {
    return this.serviceService.findAll(query);
  }

  @RequirePermissions('services.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    return this.serviceService.findOne(id);
  }

  @RequirePermissions('services.create')
  @Post()
  create(@Body() dto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.serviceService.create(dto);
  }

  @RequirePermissions('services.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.serviceService.update(id, dto);
  }

  @RequirePermissions('services.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.serviceService.remove(id);
  }

  @RequirePermissions('services.read')
  @Get(':id/requirements')
  findRequirements(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceRequirementResponseDto[]> {
    return this.serviceService.findRequirements(id);
  }

  @RequirePermissions('services.update')
  @Post(':id/requirements')
  createRequirement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateServiceRequirementDto,
  ): Promise<ServiceRequirementResponseDto> {
    return this.serviceService.createRequirement(id, dto);
  }

  @RequirePermissions('services.update')
  @Patch(':id/requirements/:requirementId')
  updateRequirement(
    @Param('id', ParseIntPipe) id: number,
    @Param('requirementId', ParseIntPipe) requirementId: number,
    @Body() dto: UpdateServiceRequirementDto,
  ): Promise<ServiceRequirementResponseDto> {
    return this.serviceService.updateRequirement(id, requirementId, dto);
  }

  @RequirePermissions('services.read')
  @Get(':id/assignments')
  findAssignments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceAssignmentResponseDto[]> {
    return this.serviceService.findAssignments(id);
  }

  @RequirePermissions('services.assign')
  @Post(':id/assignments')
  createAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateServiceAssignmentDto,
  ): Promise<ServiceAssignmentResponseDto> {
    return this.serviceService.createAssignment(id, dto);
  }

  @RequirePermissions('services.assign')
  @Patch(':id/assignments/:assignmentId')
  updateAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: UpdateServiceAssignmentDto,
  ): Promise<ServiceAssignmentResponseDto> {
    return this.serviceService.updateAssignment(id, assignmentId, dto);
  }

  @RequirePermissions('services.unassign')
  @HttpCode(204)
  @Delete(':id/assignments/:assignmentId')
  removeAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<void> {
    return this.serviceService.removeAssignment(id, assignmentId);
  }
}
