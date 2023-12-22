import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('/api/v1/members/authentcated')
export class MembersAuthenticatedController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/me')
  getMe() {}
}
