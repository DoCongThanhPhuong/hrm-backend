import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class ExistRegisterDto extends SendMailDto<ExistRegisterContextDto> {}

class ExistRegisterContextDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  loginLink: string;
}
