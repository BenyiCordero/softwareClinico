import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreateEmergencyContactDto } from './dto/request/create-emergency-contact.dto';
import { CreatePatientDto } from './dto/request/create-patient.dto';
import { FindPatientQueryDto } from './dto/request/find-patient-query.dto';
import { UpdateEmergencyContactDto } from './dto/request/update-emergency-contact.dto';
import { UpdatePatientDto } from './dto/request/update-patient.dto';
import { EmergencyContactResponseDto } from './dto/response/emergency-contact-response.dto';
import { PatientResponseDto } from './dto/response/patient-response.dto';
import { PatientService } from './patient.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @RequirePermissions('patients.read')
  @Get()
  findAll(@Query() query: FindPatientQueryDto): Promise<OffsetPaginatedResult<PatientResponseDto>> { return this.patientService.findAll(query); }

  @RequirePermissions('patients.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PatientResponseDto> { return this.patientService.findOne(id); }

  @RequirePermissions('patients.create')
  @Post()
  create(@Body() dto: CreatePatientDto): Promise<PatientResponseDto> { return this.patientService.create(dto); }

  @RequirePermissions('patients.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto): Promise<PatientResponseDto> { return this.patientService.update(id, dto); }

  @RequirePermissions('patients.deactivate')
  @HttpCode(204)
  @Delete(':id')
  archive(@Param('id', ParseIntPipe) id: number): Promise<void> { return this.patientService.archive(id); }

  @RequirePermissions('patients.read')
  @Get(':id/emergency-contacts')
  contacts(@Param('id', ParseIntPipe) id: number): Promise<EmergencyContactResponseDto[]> { return this.patientService.findContacts(id); }

  @RequirePermissions('patients.update')
  @Post(':id/emergency-contacts')
  createContact(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateEmergencyContactDto): Promise<EmergencyContactResponseDto> { return this.patientService.createContact(id, dto); }

  @RequirePermissions('patients.update')
  @Patch(':id/emergency-contacts/:contactId')
  updateContact(@Param('id', ParseIntPipe) id: number, @Param('contactId', ParseIntPipe) contactId: number, @Body() dto: UpdateEmergencyContactDto): Promise<EmergencyContactResponseDto> { return this.patientService.updateContact(id, contactId, dto); }

  @RequirePermissions('patients.update')
  @HttpCode(204)
  @Delete(':id/emergency-contacts/:contactId')
  archiveContact(@Param('id', ParseIntPipe) id: number, @Param('contactId', ParseIntPipe) contactId: number): Promise<void> { return this.patientService.archiveContact(id, contactId); }
}
