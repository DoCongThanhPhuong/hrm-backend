import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthorizationService } from '../authorization.service';
import { PERMISSIONS_KEY } from '../constants/auth.constant';
import { IMetadataPermission } from '../interfaces';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<IMetadataPermission>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermissions.permissionCodes.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const hasPermission = await this.authorizationService.hasPermission({
      userId: user.id,
      permissionCodes: requiredPermissions.permissionCodes,
      isRequiredAllPermissions: requiredPermissions.isRequiredAllPermissions,
    });

    if (!hasPermission)
      throw new ForbiddenException('AUTH::FORBIDDEN_RESOURCE');

    return true;
  }
}
