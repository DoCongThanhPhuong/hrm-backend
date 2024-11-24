import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString({ message: 'AUTH::NAME_MUST_BE_STRING' })
  @IsNotEmpty({ message: 'AUTH::NAME_IS_REQUIRED' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::DESCRIPTION_MUST_BE_STRING' })
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsArray({ message: 'AUTH::PERMISSION_LIST_IS_INVALID' })
  @IsUUID('all', { each: true, message: 'AUTH::PERMISSION_LIST_IS_INVALID' })
  @ArrayMinSize(1, { message: 'AUTH::PERMISSION_LIST_MIN_LENGTH_IS_INVALID' })
  permissions: string[];
}
