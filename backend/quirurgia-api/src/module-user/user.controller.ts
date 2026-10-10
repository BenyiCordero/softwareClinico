import {
  Body,
  Controller,
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
import { AuthorizationService } from './authorization.service';
import { AssignUserRoleDto } from './dto/request/assign-user-role.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { ChangeStatusDto } from './dto/request/change-status.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { CreateUserPermissionOverrideDto } from './dto/request/create-user-permission-override.dto';
import { FindUserQueryDto } from './dto/request/find-user-query.dto';
import { UserUpdateDto } from './dto/request/user-update.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @RequirePermissions('users.read')
  @Get()
  findAll(
    @Query() query: FindUserQueryDto,
  ): Promise<OffsetPaginatedResult<UserResponseDto>> {
    return this.userService.findAll(query);
  }

  @RequirePermissions('users.read')
  @Get('me')
  getMe(@Req() req: Request): Promise<UserResponseDto> {
    const actor = req.user as { userId: number };
    return this.userService.findOne(actor.userId);
  }

  @RequirePermissions('users.create')
  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @RequirePermissions('users.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @RequirePermissions('users.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, dto);
  }

  @RequirePermissions('users.change_password')
  @Patch(':id/password')
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    return this.userService.changePassword(id, dto);
  }

  @RequirePermissions('users.update')
  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const actor = req.user as { userId: number };
    return this.userService.changeStatus(id, dto, actor.userId);
  }

  @RequirePermissions('users.manage_roles')
  @Post(':id/roles')
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignUserRoleDto,
  ): Promise<UserResponseDto> {
    return this.userService.assignRole(id, dto);
  }

  @RequirePermissions('users.manage_roles')
  @HttpCode(204)
  @Patch(':id/roles/:userRoleId/revoke')
  async revokeRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('userRoleId', ParseIntPipe) userRoleId: number,
  ): Promise<void> {
    await this.userService.revokeRole(id, userRoleId);
  }

  @RequirePermissions('users.manage_overrides')
  @HttpCode(204)
  @Post(':id/permission-overrides')
  async createPermissionOverride(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateUserPermissionOverrideDto,
    @Req() req: Request,
  ): Promise<void> {
    const actor = req.user as { userId: number };
    await this.userService.createPermissionOverride(id, dto, actor.userId);
  }

  @RequirePermissions('users.manage_overrides')
  @HttpCode(204)
  @Patch(':id/permission-overrides/:overrideId/revoke')
  async revokePermissionOverride(
    @Param('id', ParseIntPipe) id: number,
    @Param('overrideId', ParseIntPipe) overrideId: number,
  ): Promise<void> {
    await this.userService.revokePermissionOverride(id, overrideId);
  }

  @RequirePermissions('users.read')
  @Get(':id/permissions')
  async getEffectivePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Query('branchId') branchId?: string,
  ): Promise<string[]> {
    const parsedBranchId = branchId ? Number(branchId) : undefined;
    const permissions = await this.authorizationService.getEffectivePermissions(
      id,
      parsedBranchId,
    );
    return [...permissions].sort();
  }
}
