import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class ForgotPwdDto extends SendMailDto<ForgotPwdContextDto> {}

class ForgotPwdContextDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  resetPwdLink: string;
}
