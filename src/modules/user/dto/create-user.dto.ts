import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

import { PHONE_REGEX } from '../../../constants';
import { EUserStatus } from '../constants/user.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'USER::NAME_MUST_BE_STRING' })
  @MaxLength(250, {
    message: 'AUTH::MAX_LENGTH_IS_250',
  })
  name: string;

  @ApiProperty()
  @IsString({ message: 'USER::PHONE_MUST_BE_STRING' })
  @IsOptional()
  @Matches(new RegExp(PHONE_REGEX, 'i'), {
    message: 'AUTH::PHONE_INVALID_FORMAT',
  })
  phone?: string;

  @ApiProperty()
  @IsString({ message: 'USER::DESCRIPTION_MUST_BE_STRING' })
  @IsOptional()
  @MaxLength(250, {
    message: 'AUTH::MAX_LENGTH_IS_250',
  })
  description?: string;

  @ApiProperty()
  @IsString({ message: 'USER::ROLE_IS_INVALID' })
  @IsOptional()
  @IsUUID('all', { message: 'USER::ROLE_IS_INVALID' })
  role?: string;

  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString({ message: 'USER::PASSWORD_MUST_BE_STRING' })
  password: string;

  @ApiPropertyOptional()
  status?: EUserStatus;
}
