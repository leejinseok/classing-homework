import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberSubscribeShoolPageRequest } from './dto/member.request';

@Controller('/api/v1/members/authentcated')
export class MembersAuthenticatedController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/me')
  getMe() {}

  @Post('/school-page/subscribe')
  async subscribeSchoolPage(
    @Body() memberSubscribeShoolPageRequest: MemberSubscribeShoolPageRequest,
    @Request() req,
  ) {
    await this.memberService.subscribeSchoolPage(
      memberSubscribeShoolPageRequest.schoolPageId,
      req.user.sub,
    );
  }
}
