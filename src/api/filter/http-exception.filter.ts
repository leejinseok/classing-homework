import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Provider,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}

export const httpExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
