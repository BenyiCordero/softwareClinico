import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { CreateRolePermission } from './dto/request/create-role-permissions.dto';
import { RolePermissionService } from './role-permission.service';
import { RoleService } from './role.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Get(':id')
  @RequirePermissions('roles.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findRoleOrThrowById(id);
  }

  @Post()
  @RequirePermissions('roles.create')
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Post(':id/permissions')
  @RequirePermissions('roles.manage_permissions')
  addPermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRolePermission,
  ) {
    return this.rolePermissionService.create({ ...dto, roleId: id });
  }
}
