import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

import { PHONE_REGEX } from '../../../../constants';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::NAME_MUST_BE_STRING' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::PHONE_MUST_BE_STRING' })
  @IsOptional()
  @Matches(new RegExp(PHONE_REGEX, 'i'), {
    message: 'AUTH::PHONE_INVALID_FORMAT',
  })
  phone: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::COMPANY_MUST_BE_STRING' })
  @IsOptional()
  company?: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::CODE_MUST_BE_STRING' })
  code: string;

  @ApiProperty()
  @IsString({ message: 'AUTH::DESCRIPTION_MUST_BE_STRING' })
  @IsOptional()
  description?: string;
}
