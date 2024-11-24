import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AdminCreateUserDto, AdminUpdateUserDto } from './dto';
import { ListUserPaginationDto } from './dto/list-user-pagination.dto';
import { UserService } from './user.service';
import { EnhancedParseUUIDPipe } from '../../pipes/uuid-parse.pipe';
import { EAction, EModule } from '../auth/constants/auth.enum';
import { RequiredPermissions } from '../auth/decorators';

@Controller('admin/users')
@ApiTags('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @RequiredPermissions([
    {
      action: EAction.CREATE,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  create(@Body() createUserDto: AdminCreateUserDto) {
    return this.usersService.adminCreate(createUserDto);
  }

  @Get()
  @RequiredPermissions([
    {
      action: EAction.VIEW_ALL,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  findAll(
    @Query()
    query: ListUserPaginationDto,
  ) {
    return this.usersService.getListUser(query);
  }

  @Get(':id')
  @RequiredPermissions([
    {
      action: EAction.VIEW_DETAIL,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.EDIT,
      module: EModule.USER_MANAGEMENT,
    },
    {
      action: EAction.ARCHIVE,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  findOne(@Param('id', new EnhancedParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredPermissions([
    {
      action: EAction.EDIT,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  update(
    @Param('id', new EnhancedParseUUIDPipe()) id: string,
    @Body() updateUserDto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdate(id, updateUserDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @RequiredPermissions([
    {
      action: EAction.ARCHIVE,
      module: EModule.USER_MANAGEMENT,
    },
  ])
  changeStatus(@Param('id', new EnhancedParseUUIDPipe()) id: string) {
    return this.usersService.changeStatus(id);
  }
}
