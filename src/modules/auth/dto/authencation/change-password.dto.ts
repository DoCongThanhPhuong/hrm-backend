import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../constants';
import { NotEqual } from '../../decorators/';

export class ChangePwdDto {
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
    message: 'USER::PASSWORD_IS_REQUIRED',
  })
  @Matches(new RegExp(PASSWORD_REGEX, 'i'), {
    message: 'AUTH::PASSWORD_INVALID_FORMAT',
  })
  @NotEqual('password', {
    message: 'AUTH::PASSWORDS_MUST_DIFFERENCE',
  })
  newPassword: string;
}
