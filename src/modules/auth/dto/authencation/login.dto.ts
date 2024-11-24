import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../constants';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'USER::PASSWORD_IS_REQUIRED',
  })
  @Matches(new RegExp(PASSWORD_REGEX, 'i'), {
    message: 'AUTH::PASSWORD_INVALID_FORMAT',
  })
  password: string;
}
