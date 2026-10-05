import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePositionDto } from './dto/request/create-position.dto';
import { FindPositionQueryDto } from './dto/request/find-position-query.dto';
import { UpdatePositionDto } from './dto/request/update-position.dto';
import { PositionResponseDto } from './dto/response/position-response.dto';
import { PositionService } from './position.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @RequirePermissions('positions.read')
  @Get()
  findAll(@Query() query?: FindPositionQueryDto): Promise<OffsetPaginatedResult<PositionResponseDto>> {
    return this.positionService.findAll(query);
  }

  @RequirePermissions('positions.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PositionResponseDto> {
    return this.positionService.findOne(id);
  }

  @RequirePermissions('positions.create')
  @Post()
  create(@Body() dto: CreatePositionDto): Promise<PositionResponseDto> {
    return this.positionService.create(dto);
  }

  @RequirePermissions('positions.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePositionDto): Promise<PositionResponseDto> {
    return this.positionService.update(id, dto);
  }

  @RequirePermissions('positions.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.positionService.remove(id);
  }
}
