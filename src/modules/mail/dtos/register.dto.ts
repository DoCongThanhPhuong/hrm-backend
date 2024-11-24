import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class RegisterDto extends SendMailDto<RegisterContextDto> {}

class RegisterContextDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  pwd: string;

  @IsUrl()
  @IsNotEmpty()
  loginLink: string;
}
