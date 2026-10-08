import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorator/require-permissions.decorator';
import { AuthorizationService } from '../../module-user/authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { userId: number } | undefined;
    if (!user) return false;

    const branchId = this.getBranchId(request);
    const allowed = await this.authorizationService.hasAllPermissions(user.userId, required, branchId);
    if (!allowed) throw new ForbiddenException('Missing required permission');
    return true;
  }

  private getBranchId(request: Request): number | undefined {
    const header = request.headers['x-branch-id'];
    const value = Array.isArray(header) ? header[0] : header;
    if (!value) return undefined;
    const branchId = Number(value);
    return Number.isInteger(branchId) && branchId > 0 ? branchId : undefined;
  }
}