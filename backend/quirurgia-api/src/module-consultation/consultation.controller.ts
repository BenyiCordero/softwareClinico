import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { ConsultationService } from './consultation.service';
import {
  CreateClinicalNoteDto,
  CreateConsultationDto,
  CreateDiagnosisDto,
  CreateTreatmentDto,
  UpdateConsultationDto,
} from './dto';
@Controller('consultations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConsultationController {
  constructor(private service: ConsultationService) {}
  @Get() @RequirePermissions('consultations.read') findAll() {
    return this.service.findAll();
  }
  @Get(':id') @RequirePermissions('consultations.read') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @Post() @RequirePermissions('consultations.create') create(
    @Body() dto: CreateConsultationDto,
  ) {
    return this.service.create(dto);
  }
  @Patch(':id') @RequirePermissions('consultations.update') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultationDto,
  ) {
    return this.service.update(id, dto);
  }
  @Get(':id/diagnoses') @RequirePermissions('consultations.read') diagnoses(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.diagnoses(id);
  }
  @Post(':id/diagnoses')
  @RequirePermissions('consultations.update')
  addDiagnosis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDiagnosisDto,
  ) {
    return this.service.addDiagnosis(id, dto);
  }
  @Get(':id/treatments') @RequirePermissions('consultations.read') treatments(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.treatments(id);
  }
  @Post(':id/treatments')
  @RequirePermissions('consultations.update')
  addTreatment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTreatmentDto,
  ) {
    return this.service.addTreatment(id, dto);
  }
  @Get(':id/notes') @RequirePermissions('consultations.read') notes(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.notesFor(id);
  }
  @Post(':id/notes') @RequirePermissions('consultations.update') addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateClinicalNoteDto,
  ) {
    return this.service.addNote(id, dto);
  }
}
