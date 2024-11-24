import { HttpStatus } from '@nestjs/common';

export interface IResponseMessage {
  statusCode: HttpStatus;
  message: string;
}
