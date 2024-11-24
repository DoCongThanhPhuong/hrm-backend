import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PERMISSIONS_KEY } from '../constants/auth.constant';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { IMetadataPermission, IRequiredPermission } from '../interfaces';

export const RequiredPermissions = (
  permissions: IRequiredPermission[],
  isRequiredAllPermissions = false,
) => {
  const permissionCodes: Set<string> = new Set();
  permissions.forEach((permission) =>
    permissionCodes.add(
      `${permission.module.toUpperCase()}::${permission.action.toUpperCase()}`,
    ),
  );

  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, {
      permissionCodes: Array.from(permissionCodes),
      isRequiredAllPermissions,
    } as IMetadataPermission),
    UseGuards(JwtAuthGuard, PermissionGuard),
    ApiBearerAuth(),
  );
};
