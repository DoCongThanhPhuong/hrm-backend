import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch()
export class ExceptionFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    return this.handleExceptionWithHttpContext(exception, host);
  }

  async handleExceptionWithHttpContext(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(await this.getMessage(exception));
    } else {
      Logger.error(exception.stack);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'COMMON::SOMETHING_WENT_WRONG',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async getMessage(exception: HttpException) {
    const exceptionResponse = exception.getResponse() as any;

    if (exceptionResponse.hasOwnProperty('message')) {
      if (exceptionResponse.message instanceof Array) {
        exceptionResponse.message = await this.formatArrayMessages(
          exceptionResponse.message,
        );
      } else {
        if (
          exceptionResponse.message.match(
            /^Unexpected token .* JSON at position [\d]*$/,
          )
        )
          exceptionResponse.message = 'COMMON::INVALID_BODY_FORMAT';
      }

      return {
        statusCode: exception.getStatus(),
        message: exceptionResponse.message || exceptionResponse,
      };
    }
    return {
      statusCode: exception.getStatus(),
      message: exceptionResponse,
    };
  }

  async formatArrayMessages(errors: any[]) {
    const data = [];
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (typeof item === 'string') {
        data.push(item);
        continue;
      } else if (item instanceof ValidationError) {
        await this.getValidateErrorMessages(item, data);
        continue;
      }
      data.push(item);
    }
    return data;
  }

  async getValidateErrorMessages(node: ValidationError, data) {
    if (node.constraints) {
      const message = await Promise.all(
        Object.values(node.constraints).map(async (value: string) => value),
      );
      data.push({ field: node.property, message: message });
    }
    if (node.children && node.children.length !== 0) {
      node.children.forEach((item) => {
        this.getValidateErrorMessages(item, data);
      });
    } else {
      return data;
    }
  }
}
