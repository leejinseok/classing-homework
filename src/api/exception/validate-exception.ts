import { HttpException } from '@nestjs/common';

export class ValidateException extends HttpException {
  messages: string[];

  constructor(messages: string[]) {
    super(`${messages}`, 400);
    this.messages = messages;
  }
}
