import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/config/meta';

@Controller()
export class AppController {

  @Public()
  @Get()
  getHello(): string {
    return 'hello';
  }
}
