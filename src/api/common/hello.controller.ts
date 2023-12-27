import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../config/metadata';

@ApiTags('HelloController')
@Controller()
export class HelloController {
  @ApiOperation({ summary: 'hello' })
  @Public()
  @Get('/hello')
  getHello(): string {
    return 'hello';
  }
}
