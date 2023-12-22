import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('/api/v1/members/authenticated')
export class MembersAuthenticatedController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/me')
  getMe() {}

  @Post('/school-pages/:schoolPageId/subscribe')
  async subscribeSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Request() req,
  ) {
    await this.memberService.subscribeSchoolPage(schoolPageId, req.user.sub);
  }

  @Post('/school-pages/:schoolPageId/unsubscribe')
  async unsubscribeSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Request() req,
  ) {
    await this.memberService.unsubscribeSchoolPage(schoolPageId, req.user.sub);
  }
}
