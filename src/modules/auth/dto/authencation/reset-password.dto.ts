import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../constants';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'USER::PASSWORD_IS_REQUIRED',
  })
  @Matches(new RegExp(PASSWORD_REGEX, 'i'), {
    message: 'AUTH::PASSWORD_INVALID_FORMAT',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'USER::TOKEN_IS_REQUIRED',
  })
  token: string;
}
