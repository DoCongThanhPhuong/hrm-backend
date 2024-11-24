export interface IRequiredPermission {
  module: string;
  action: string;
}

export interface IMetadataPermission {
  permissionCodes: string[];
  isRequiredAllPermissions: boolean;
}

export interface IHasPermission extends IMetadataPermission {
  userId: string;
}
