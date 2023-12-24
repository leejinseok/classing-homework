import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationError, ValidatorOptions } from 'class-validator';
import { ValidateException } from '../exception/validate-exception';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

export const validationPipe: Provider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      }));
      const messages = result.map((result) => result.message);
      return new ValidateException(messages);
    },
    stopAtFirstError: true,
  }),
};
