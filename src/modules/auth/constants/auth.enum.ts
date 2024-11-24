export enum AUTH_KEY {
  FORGOT_PWD = 'FORGOT_PWD',
}

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum EAction {
  ALL_ACTION = '*',
  VIEW_ALL = 'VIEW_ALL',
  VIEW_DETAIL = 'VIEW_DETAIL',
  VIEW_ALL_PERMISSIONS = 'VIEW_ALL_PERMISSIONS',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  INVITE = 'INVITE',
  DELETE = 'DELETE',
  DELETE_DRAFT = 'DELETE_DRAFT',
  DELETE_PUBLIC = 'DELETE_PUBLIC',
  ASSIGN = 'ASSIGN',
  ARCHIVE = 'ARCHIVE',
  PUBLISH = 'PUBLISH',
}

export enum EModule {
  PROFILE_MANAGEMENT = 'PROFILE_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_AND_PERMISSIONS = 'ROLES_AND_PERMISSIONS',
}
