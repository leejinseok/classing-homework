import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ValidateException } from '../exception/validate-exception';

@Catch(ValidateException)
export class ValidateExceptionFilter implements ExceptionFilter {
  catch(exception: ValidateException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.messages,
    });
  }
}
