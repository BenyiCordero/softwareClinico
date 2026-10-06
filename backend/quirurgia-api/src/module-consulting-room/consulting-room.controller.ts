import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { ConsultingRoomService } from './consulting-room.service';
import { CreateConsultingRoomDto } from './dto/request/create-consulting-room.dto';
import { FindConsultingRoomQueryDto } from './dto/request/find-consulting-room-query.dto';
import { UpdateConsultingRoomDto } from './dto/request/update-consulting-room.dto';
import { ConsultingRoomResponseDto } from './dto/response/consulting-room-response.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('consulting-rooms')
export class ConsultingRoomController {
  constructor(private readonly consultingRoomService: ConsultingRoomService) {}

  @RequirePermissions('consulting-rooms.read')
  @Get()
  findAll(@Query() query?: FindConsultingRoomQueryDto): Promise<OffsetPaginatedResult<ConsultingRoomResponseDto>> {
    return this.consultingRoomService.findAll(query);
  }

  @RequirePermissions('consulting-rooms.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ConsultingRoomResponseDto> {
    return this.consultingRoomService.findOne(id);
  }

  @RequirePermissions('consulting-rooms.create')
  @Post()
  create(@Body() dto: CreateConsultingRoomDto): Promise<ConsultingRoomResponseDto> {
    return this.consultingRoomService.create(dto);
  }

  @RequirePermissions('consulting-rooms.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultingRoomDto,
  ): Promise<ConsultingRoomResponseDto> {
    return this.consultingRoomService.update(id, dto);
  }

  @RequirePermissions('consulting-rooms.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.consultingRoomService.remove(id);
  }
}
