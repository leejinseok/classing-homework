import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/api/config/metadata';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'hello';
  }
}
