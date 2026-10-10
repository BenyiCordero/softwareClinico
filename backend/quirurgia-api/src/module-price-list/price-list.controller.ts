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
import { CreatePriceListDetailDto } from './dto/request/create-price-list-detail.dto';
import { CreatePriceListDto } from './dto/request/create-price-list.dto';
import { FindPriceListQueryDto } from './dto/request/find-price-list-query.dto';
import { UpdatePriceListDetailDto } from './dto/request/update-price-list-detail.dto';
import { UpdatePriceListDto } from './dto/request/update-price-list.dto';
import { PriceListDetailResponseDto } from './dto/response/price-list-detail-response.dto';
import { PriceListResponseDto } from './dto/response/price-list-response.dto';
import { PriceListService } from './price-list.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('price-lists')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}
  @RequirePermissions('price-lists.read') @Get() findAll(
    @Query() query?: FindPriceListQueryDto,
  ): Promise<OffsetPaginatedResult<PriceListResponseDto>> {
    return this.priceListService.findAll(query);
  }
  @RequirePermissions('price-lists.read') @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PriceListResponseDto> {
    return this.priceListService.findOne(id);
  }
  @RequirePermissions('price-lists.create') @Post() create(
    @Body() dto: CreatePriceListDto,
  ): Promise<PriceListResponseDto> {
    return this.priceListService.create(dto);
  }
  @RequirePermissions('price-lists.update') @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceListDto,
  ): Promise<PriceListResponseDto> {
    return this.priceListService.update(id, dto);
  }
  @RequirePermissions('price-lists.publish') @Post(':id/publish') publish(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PriceListResponseDto> {
    return this.priceListService.publish(id);
  }
  @RequirePermissions('price-lists.unpublish') @Post(':id/unpublish') unpublish(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PriceListResponseDto> {
    return this.priceListService.unpublish(id);
  }
  @RequirePermissions('price-lists.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.priceListService.remove(id);
  }
  @RequirePermissions('price-lists.read') @Get(':id/details') findDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PriceListDetailResponseDto[]> {
    return this.priceListService.findDetails(id);
  }
  @RequirePermissions('price-lists.update') @Post(':id/details') createDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePriceListDetailDto,
  ): Promise<PriceListDetailResponseDto> {
    return this.priceListService.createDetail(id, dto);
  }
  @RequirePermissions('price-lists.update')
  @Patch(':id/details/:detailId')
  updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() dto: UpdatePriceListDetailDto,
  ): Promise<PriceListDetailResponseDto> {
    return this.priceListService.updateDetail(id, detailId, dto);
  }
  @RequirePermissions('price-lists.update')
  @HttpCode(204)
  @Delete(':id/details/:detailId')
  removeDetail(
    @Param('id', ParseIntPipe) id: number,
    @Param('detailId', ParseIntPipe) detailId: number,
  ): Promise<void> {
    return this.priceListService.removeDetail(id, detailId);
  }
}
