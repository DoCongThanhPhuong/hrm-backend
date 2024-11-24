import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { QueryPaginationDto } from '../../../common/dto/query-pagination.dto';
import { EUserStatus } from '../constants/user.enum';

export class ListUserPaginationDto extends QueryPaginationDto {
  @IsString({ message: 'COMMON::SEARCH_MUST_BE_STRING' })
  @IsOptional()
  search: string;

  @IsString({
    message: 'USER::ROLE_INVALID_UUID_FORMAT',
  })
  @IsOptional()
  @IsUUID('all', {
    message: 'USER::ROLE_INVALID_UUID_FORMAT',
  })
  role: string;

  @IsString({
    message: 'USER::STATUS_INVALID',
  })
  @IsOptional()
  @IsEnum(EUserStatus, {
    message: 'USER::STATUS_INVALID',
  })
  status: EUserStatus;
}
