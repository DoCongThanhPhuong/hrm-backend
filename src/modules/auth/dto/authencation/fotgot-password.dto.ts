import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class ForgotPwdDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
