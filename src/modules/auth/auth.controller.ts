import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticationService } from './authentication.service';
import { AuthorizationService } from './authorization.service';
import { EAction, EModule } from './constants/auth.enum';
import { CurrentUser, RequiredPermissions } from './decorators';
import {
  AssignRoleDto,
  ChangePwdDto,
  CreateRoleDto,
  ForgotPwdDto,
  InviteUserDto,
  ListRolePaginationDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateRoleDto,
} from './dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IJwtPayload } from './interfaces';
import { EnhancedParseUUIDPipe } from '../../pipes/uuid-parse.pipe';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  refreshToken(@CurrentUser() user: IJwtPayload) {
    return this.authenticationService.refreshToken(user?.sub);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPwdDto) {
    return this.authenticationService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authenticationService.resetPassword(body);
  }

  @Post('change-password')
  @RequiredPermissions([
    {
      action: EAction.CHANGE_PASSWORD,
      module: EModule.PROFILE_MANAGEMENT,
    },
  ])
  changePassword(@CurrentUser() user: IJwtPayload, @Body() body: ChangePwdDto) {
    return this.authenticationService.changePassword(user.email, body);
  }

  @Post('invitation')
  @RequiredPermissions([
    {
      action: EAction.INVITE,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  invite(@Body() body: InviteUserDto) {
    return this.authenticationService.inviteUser(body);
  }

  @Post('roles')
  @RequiredPermissions([
    {
      action: EAction.CREATE,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
  ])
  createRole(@Body() body: CreateRoleDto) {
    return this.authorizationService.creatRole(body);
  }

  @Patch('roles/:id')
  @RequiredPermissions([
    {
      action: EAction.EDIT,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
  ])
  updateRole(
    @Body() body: UpdateRoleDto,
    @Param('id', new EnhancedParseUUIDPipe()) roleId: string,
  ) {
    return this.authorizationService.updateRole(roleId, body);
  }

  @Get('roles')
  @RequiredPermissions([
    {
      action: EAction.VIEW_ALL,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.VIEW_ALL,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.EDIT,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.CREATE,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  getRoles(@Query() query: ListRolePaginationDto) {
    return this.authorizationService.getListRoles(query);
  }

  @Get('roles/:id')
  @RequiredPermissions([
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.DELETE,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.EDIT,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
  ])
  getRole(@Param('id', new EnhancedParseUUIDPipe()) roleId: string) {
    return this.authorizationService.getRoleDetail(roleId);
  }

  @Delete('roles/:id')
  @RequiredPermissions([
    {
      action: EAction.DELETE,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
  ])
  deleteRole(@Param('id', new EnhancedParseUUIDPipe()) roleId: string) {
    return this.authorizationService.deleteRole(roleId);
  }

  @Post('roles/assign')
  @RequiredPermissions(
    [
      {
        action: EAction.VIEW_ALL,
        module: EModule.ROLE_AND_PERMISSIONS,
      },
      {
        action: EAction.VIEW_ALL,
        module: EModule.USER_MANAGEMENT,
      },
      {
        action: EAction.EDIT,
        module: EModule.USER_MANAGEMENT,
      },
    ],
    true,
  )
  assignRoleForUsers(@Body() payload: AssignRoleDto) {
    return this.authorizationService.assignRole(payload);
  }

  @Get('permissions')
  @RequiredPermissions([
    {
      action: EAction.VIEW_ALL_PERMISSIONS,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.CREATE,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.EDIT,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
    {
      action: EAction.VIEW_ALL,
      module: EModule.ROLE_AND_PERMISSIONS,
    },
  ])
  getPermissions() {
    return this.authorizationService.getPermissions();
  }

  @Get('current-user/permissions')
  @RequiredPermissions([])
  getCurrentUserPermissions(@CurrentUser() user: IJwtPayload) {
    return this.authorizationService.getCurrentUserPermissions(user.id);
  }
}
