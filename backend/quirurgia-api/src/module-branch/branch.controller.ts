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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/request/create-branch.dto';
import { FindBranchQueryDto } from './dto/request/find-branch-query.dto';
import { UpdateBranchDto } from './dto/request/update-branch.dto';
import { BranchResponseDto } from './dto/response/branch-response.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @RequirePermissions('branches.read')
  @Get()
  findAll(
    @Query() query?: FindBranchQueryDto,
  ): Promise<OffsetPaginatedResult<BranchResponseDto>> {
    return this.branchService.findAll(query);
  }

  @RequirePermissions('branches.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BranchResponseDto> {
    return this.branchService.findOne(id);
  }

  @RequirePermissions('branches.create')
  @Post()
  create(@Body() dto: CreateBranchDto): Promise<BranchResponseDto> {
    return this.branchService.create(dto);
  }

  @RequirePermissions('branches.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    return this.branchService.update(id, dto);
  }

  @RequirePermissions('branches.archive')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.branchService.remove(id);
  }
}
