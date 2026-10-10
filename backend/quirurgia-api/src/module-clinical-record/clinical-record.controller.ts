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
import { ClinicalRecordService } from './clinical-record.service';
import {
  CreateClinicalDocumentDto,
  CreateClinicalRecordDto,
  CreateMedicalHistoryDto,
  UpdateClinicalDocumentDto,
  UpdateClinicalRecordDto,
} from './dto';

@Controller('clinical-records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClinicalRecordController {
  constructor(private service: ClinicalRecordService) {}
  @Get() @RequirePermissions('clinical-records.read') findAll() {
    return this.service.findAll();
  }
  @Get(':id') @RequirePermissions('clinical-records.read') findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
  @Post() @RequirePermissions('clinical-records.create') create(
    @Body() dto: CreateClinicalRecordDto,
  ) {
    return this.service.create(dto);
  }
  @Patch(':id') @RequirePermissions('clinical-records.update') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicalRecordDto,
  ) {
    return this.service.update(id, dto);
  }
  @Get(':id/history') @RequirePermissions('clinical-records.read') history(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.history(id);
  }
  @Post(':id/history')
  @RequirePermissions('clinical-records.update')
  saveHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMedicalHistoryDto,
    @Req() req: Request,
  ) {
    return this.service.saveHistory(
      id,
      (req.user as { userId: number }).userId,
      dto,
    );
  }
  @Get(':id/documents') @RequirePermissions('clinical-records.read') documents(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.documentsFor(id);
  }
  @Post(':id/documents')
  @RequirePermissions('clinical-records.update')
  createDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateClinicalDocumentDto,
    @Req() req: Request,
  ) {
    return this.service.createDocument(
      id,
      (req.user as { userId: number }).userId,
      dto,
    );
  }
  @Patch(':id/documents/:documentId')
  @RequirePermissions('clinical-records.update')
  updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: UpdateClinicalDocumentDto,
  ) {
    return this.service.updateDocument(id, documentId, dto);
  }
}
