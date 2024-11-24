import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { EAction, EModule } from '../auth/constants/auth.enum';
import { CurrentUser, RequiredPermissions } from '../auth/decorators';
import { IJwtPayload } from '../auth/interfaces';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('profile')
  @RequiredPermissions([
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.PROFILE_MANAGEMENT,
    },
  ])
  getMe(@CurrentUser() user: IJwtPayload) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user information',
  })
  @RequiredPermissions([
    {
      action: EAction.EDIT,
      module: EModule.PROFILE_MANAGEMENT,
    },
  ])
  updateProfile(
    @CurrentUser() user: IJwtPayload,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, payload);
  }
}
