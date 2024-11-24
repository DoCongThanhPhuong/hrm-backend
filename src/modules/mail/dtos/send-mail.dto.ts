import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto<T> {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  context: T;
}
