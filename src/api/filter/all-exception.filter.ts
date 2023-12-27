import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Provider,
} from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { winstonLogger } from '../../common/util/winston.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    winstonLogger.error({
      timestamp: new Date().toISOString(),
      status,
      exception: exception.message,
    });

    const responseBody = {
      statusCode: status,
      message: '예기치 않은 에러가 발생하였습니다',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}

export const allExceptionsFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
};
