import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/api/config/metadata';

@ApiTags('루트 (Root)')
@Controller()
export class HelloController {
  @ApiOperation({ summary: 'hello' })
  @Public()
  @Get('/hello')
  getHello(): string {
    return 'hello';
  }
}
