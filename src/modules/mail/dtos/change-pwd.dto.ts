import { IsNotEmpty, IsString } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class ChangePwdDto extends SendMailDto<ChangePwdContextDto> {}

class ChangePwdContextDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
