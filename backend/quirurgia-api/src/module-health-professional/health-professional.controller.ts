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
import { AssignProfessionalSpecialtyDto } from './dto/request/assign-professional-specialty.dto';
import { CreateHealthProfessionalDto } from './dto/request/create-health-professional.dto';
import { FindHealthProfessionalQueryDto } from './dto/request/find-health-professional-query.dto';
import { UpdateHealthProfessionalDto } from './dto/request/update-health-professional.dto';
import { HealthProfessionalResponseDto } from './dto/response/health-professional-response.dto';
import { ProfessionalSpecialtyResponseDto } from './dto/response/professional-specialty-response.dto';
import { HealthProfessionalService } from './health-professional.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('health-professionals')
export class HealthProfessionalController {
  constructor(
    private readonly healthProfessionalService: HealthProfessionalService,
  ) {}

  @RequirePermissions('health-professionals.read')
  @Get()
  findAll(
    @Query() query?: FindHealthProfessionalQueryDto,
  ): Promise<OffsetPaginatedResult<HealthProfessionalResponseDto>> {
    return this.healthProfessionalService.findAll(query);
  }

  @RequirePermissions('health-professionals.read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HealthProfessionalResponseDto> {
    return this.healthProfessionalService.findOne(id);
  }

  @RequirePermissions('health-professionals.create')
  @Post()
  create(
    @Body() dto: CreateHealthProfessionalDto,
  ): Promise<HealthProfessionalResponseDto> {
    return this.healthProfessionalService.create(dto);
  }

  @RequirePermissions('health-professionals.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHealthProfessionalDto,
  ): Promise<HealthProfessionalResponseDto> {
    return this.healthProfessionalService.update(id, dto);
  }

  @RequirePermissions('health-professionals.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.healthProfessionalService.remove(id);
  }

  @RequirePermissions('health-professionals.read')
  @Get(':id/specialties')
  findSpecialties(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProfessionalSpecialtyResponseDto[]> {
    return this.healthProfessionalService.findSpecialties(id);
  }

  @RequirePermissions('health-professionals.assign')
  @Post(':id/specialties')
  assignSpecialty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProfessionalSpecialtyDto,
  ): Promise<ProfessionalSpecialtyResponseDto> {
    return this.healthProfessionalService.assignSpecialty(id, dto);
  }

  @RequirePermissions('health-professionals.unassign')
  @HttpCode(204)
  @Delete(':id/specialties/:professionalSpecialtyId')
  removeSpecialty(
    @Param('id', ParseIntPipe) id: number,
    @Param('professionalSpecialtyId', ParseIntPipe)
    professionalSpecialtyId: number,
  ): Promise<void> {
    return this.healthProfessionalService.removeSpecialty(
      id,
      professionalSpecialtyId,
    );
  }
}
