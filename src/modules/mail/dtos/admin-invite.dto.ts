import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { SendMailDto } from './send-mail.dto';

export class AdminInviteDto extends SendMailDto<AdminInviteContextDto> {}

class AdminInviteContextDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  pwd: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsUrl()
  @IsNotEmpty()
  loginLink: string;
}
