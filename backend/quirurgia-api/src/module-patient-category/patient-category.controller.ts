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
import { CreatePatientCategoryDto } from './dto/request/create-patient-category.dto';
import { FindPatientCategoryQueryDto } from './dto/request/find-patient-category-query.dto';
import { UpdatePatientCategoryDto } from './dto/request/update-patient-category.dto';
import { PatientCategoryResponseDto } from './dto/response/patient-category-response.dto';
import { PatientCategoryService } from './patient-category.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('patient-categories')
export class PatientCategoryController {
  constructor(
    private readonly patientCategoryService: PatientCategoryService,
  ) {}

  @RequirePermissions('patient-categories.read')
  @Get()
  findAll(
    @Query() query?: FindPatientCategoryQueryDto,
  ): Promise<OffsetPaginatedResult<PatientCategoryResponseDto>> {
    return this.patientCategoryService.findAll(query);
  }

  @RequirePermissions('patient-categories.read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientCategoryResponseDto> {
    return this.patientCategoryService.findOne(id);
  }

  @RequirePermissions('patient-categories.create')
  @Post()
  create(
    @Body() dto: CreatePatientCategoryDto,
  ): Promise<PatientCategoryResponseDto> {
    return this.patientCategoryService.create(dto);
  }

  @RequirePermissions('patient-categories.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePatientCategoryDto,
  ): Promise<PatientCategoryResponseDto> {
    return this.patientCategoryService.update(id, dto);
  }

  @RequirePermissions('patient-categories.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientCategoryService.remove(id);
  }
}
