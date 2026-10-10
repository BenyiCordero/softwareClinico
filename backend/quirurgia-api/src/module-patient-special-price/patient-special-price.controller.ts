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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePatientSpecialPriceDto } from './dto/request/create-patient-special-price.dto';
import { FindPatientSpecialPriceQueryDto } from './dto/request/find-patient-special-price-query.dto';
import { UpdatePatientSpecialPriceDto } from './dto/request/update-patient-special-price.dto';
import { PatientSpecialPriceResponseDto } from './dto/response/patient-special-price-response.dto';
import { PatientSpecialPriceService } from './patient-special-price.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('patient-special-prices')
export class PatientSpecialPriceController {
  constructor(
    private readonly specialPriceService: PatientSpecialPriceService,
  ) {}
  @RequirePermissions('patient-special-prices.read') @Get() findAll(
    @Query() query?: FindPatientSpecialPriceQueryDto,
  ): Promise<OffsetPaginatedResult<PatientSpecialPriceResponseDto>> {
    return this.specialPriceService.findAll(query);
  }
  @RequirePermissions('patient-special-prices.read') @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientSpecialPriceResponseDto> {
    return this.specialPriceService.findOne(id);
  }
  @RequirePermissions('patient-special-prices.create') @Post() create(
    @Body() dto: CreatePatientSpecialPriceDto,
    @Req() request: Request,
  ): Promise<PatientSpecialPriceResponseDto> {
    return this.specialPriceService.create(
      dto,
      (request.user as { userId: number }).userId,
    );
  }
  @RequirePermissions('patient-special-prices.update') @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePatientSpecialPriceDto,
  ): Promise<PatientSpecialPriceResponseDto> {
    return this.specialPriceService.update(id, dto);
  }
  @RequirePermissions('patient-special-prices.approve')
  @Post(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientSpecialPriceResponseDto> {
    return this.specialPriceService.approve(id);
  }
  @RequirePermissions('patient-special-prices.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.specialPriceService.remove(id);
  }
}
