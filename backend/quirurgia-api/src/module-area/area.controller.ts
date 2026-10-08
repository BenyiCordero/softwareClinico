import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/request/create-area.dto';
import { FindAreaQueryDto } from './dto/request/find-area-query.dto';
import { UpdateAreaDto } from './dto/request/update-area.dto';
import { AreaResponseDto } from './dto/response/area-response.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @RequirePermissions('areas.read')
  @Get()
  findAll(@Query() query?: FindAreaQueryDto): Promise<OffsetPaginatedResult<AreaResponseDto>> {
    return this.areaService.findAll(query);
  }

  @RequirePermissions('areas.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AreaResponseDto> {
    return this.areaService.findOne(id);
  }

  @RequirePermissions('areas.create')
  @Post()
  create(@Body() dto: CreateAreaDto): Promise<AreaResponseDto> {
    return this.areaService.create(dto);
  }

  @RequirePermissions('areas.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAreaDto): Promise<AreaResponseDto> {
    return this.areaService.update(id, dto);
  }

  @RequirePermissions('areas.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.areaService.remove(id);
  }
}
