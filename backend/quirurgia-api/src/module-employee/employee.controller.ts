import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreateEmployeeDto } from './dto/request/create-employee.dto';
import { CreateEmployeeAssignmentDto } from './dto/request/create-employee-assignment.dto';
import { EndEmployeeAssignmentDto } from './dto/request/end-employee-assignment.dto';
import { FindEmployeeQueryDto } from './dto/request/find-employee-query.dto';
import { UpdateEmployeeDto } from './dto/request/update-employee.dto';
import { EmployeeAssignmentResponseDto } from './dto/response/employee-assignment-response.dto';
import { EmployeeResponseDto } from './dto/response/employee-response.dto';
import { EmployeeService } from './employee.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @RequirePermissions('employees.read')
  @Get()
  findAll(@Query() query?: FindEmployeeQueryDto): Promise<OffsetPaginatedResult<EmployeeResponseDto>> {
    return this.employeeService.findAll(query);
  }

  @RequirePermissions('employees.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeResponseDto> {
    return this.employeeService.findOne(id);
  }

  @RequirePermissions('employees.create')
  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeeService.create(dto);
  }

  @RequirePermissions('employees.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeeService.update(id, dto);
  }

  @RequirePermissions('employees.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.employeeService.remove(id);
  }

  @RequirePermissions('employees.read')
  @Get(':id/assignments')
  findAssignments(@Param('id', ParseIntPipe) id: number): Promise<EmployeeAssignmentResponseDto[]> {
    return this.employeeService.findAssignments(id);
  }

  @RequirePermissions('employees.assign')
  @Post(':id/assignments')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEmployeeAssignmentDto,
  ): Promise<EmployeeAssignmentResponseDto> {
    return this.employeeService.assign(id, dto);
  }

  @RequirePermissions('employees.unassign')
  @HttpCode(204)
  @Patch(':id/assignments/:assignmentId/end')
  endAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: EndEmployeeAssignmentDto,
  ): Promise<void> {
    return this.employeeService.endAssignment(id, assignmentId, dto);
  }
}
