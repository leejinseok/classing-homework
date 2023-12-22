import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/api/config/metadata';

@Controller()
export class RootController {
  @Public()
  @Get('/hello')
  getHello(): string {
    return 'hello';
  }
}
