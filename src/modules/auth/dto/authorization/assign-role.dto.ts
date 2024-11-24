import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'AUTH::ROLE_ID_IS_REQUIRED' })
  @IsString({ message: 'AUTH::ROLE_ID_IS_INVALID' })
  @IsUUID('all', { message: 'AUTH::ROLE_ID_IS_INVALID' })
  roleId: string;

  @ApiProperty()
  @IsArray({ message: 'AUTH::USER_LIST_IS_INVALID' })
  @IsNotEmpty({ message: 'AUTH::USER_LIST_IS_REQUIRED' })
  @IsUUID('all', { each: true, message: 'AUTH::USER_LIST_IS_INVALID' })
  @ArrayMinSize(1, { message: 'AUTH::USER_LIST_MIN_LENGTH_IS_INVALID' })
  users: string[];
}
