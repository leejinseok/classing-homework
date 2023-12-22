import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('/api/v1/members')
export class MembersController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  findAll() {}
}
