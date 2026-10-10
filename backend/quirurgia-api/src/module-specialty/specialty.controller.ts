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
import { CreateSpecialtyDto } from './dto/request/create-specialty.dto';
import { FindSpecialtyQueryDto } from './dto/request/find-specialty-query.dto';
import { UpdateSpecialtyDto } from './dto/request/update-specialty.dto';
import { SpecialtyResponseDto } from './dto/response/specialty-response.dto';
import { SpecialtyService } from './specialty.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @RequirePermissions('specialties.read')
  @Get()
  findAll(
    @Query() query?: FindSpecialtyQueryDto,
  ): Promise<OffsetPaginatedResult<SpecialtyResponseDto>> {
    return this.specialtyService.findAll(query);
  }

  @RequirePermissions('specialties.read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SpecialtyResponseDto> {
    return this.specialtyService.findOne(id);
  }

  @RequirePermissions('specialties.create')
  @Post()
  create(@Body() dto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    return this.specialtyService.create(dto);
  }

  @RequirePermissions('specialties.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpecialtyDto,
  ): Promise<SpecialtyResponseDto> {
    return this.specialtyService.update(id, dto);
  }

  @RequirePermissions('specialties.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.specialtyService.remove(id);
  }
}
