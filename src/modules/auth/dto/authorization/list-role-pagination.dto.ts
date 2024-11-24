import { IsEnum, IsOptional, IsString } from 'class-validator';

import { QueryPaginationDto } from '../../../../common/dto/query-pagination.dto';
import { EQuerySort } from '../../../../constants';

export class ListRolePaginationDto extends QueryPaginationDto {
  @IsString({ message: 'COMMON::SEARCH_MUST_BE_STRING' })
  @IsOptional()
  search: string;

  @IsString({ message: 'COMMON::SEARCH_QUERY_INVALID' })
  @IsOptional()
  @IsEnum(EQuerySort, {
    message: 'COMMON::SEARCH_QUERY_INVALID',
  })
  sort: EQuerySort;
}
