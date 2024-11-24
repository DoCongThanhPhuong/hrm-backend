import { IsNotEmpty, IsString } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class ResetPwdDto extends SendMailDto<ResetPwdContextDto> {}

class ResetPwdContextDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
