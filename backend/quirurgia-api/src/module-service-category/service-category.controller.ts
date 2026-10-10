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
import { CreateServiceCategoryDto } from './dto/request/create-service-category.dto';
import { FindServiceCategoryQueryDto } from './dto/request/find-service-category-query.dto';
import { UpdateServiceCategoryDto } from './dto/request/update-service-category.dto';
import { ServiceCategoryResponseDto } from './dto/response/service-category-response.dto';
import { ServiceCategoryService } from './service-category.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('service-categories')
export class ServiceCategoryController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @RequirePermissions('service-categories.read')
  @Get()
  findAll(
    @Query() query?: FindServiceCategoryQueryDto,
  ): Promise<OffsetPaginatedResult<ServiceCategoryResponseDto>> {
    return this.serviceCategoryService.findAll(query);
  }

  @RequirePermissions('service-categories.read')
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.findOne(id);
  }

  @RequirePermissions('service-categories.create')
  @Post()
  create(
    @Body() dto: CreateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.create(dto);
  }

  @RequirePermissions('service-categories.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    return this.serviceCategoryService.update(id, dto);
  }

  @RequirePermissions('service-categories.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.serviceCategoryService.remove(id);
  }
}
