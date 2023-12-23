import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { PageResponse } from 'src/common/dto/page.response';
import { SchoolPageResponse } from '../school-page/dto/school-page.response';
import { MemberService } from './member.service';
import { SchoolPageNewsResponse } from '../school-page-news/dto/school-page-news.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Member Authenticated (인증 사용자)')
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

  @Patch('/school-pages/:schoolPageId/unsubscribe')
  async unsubscribeSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Request() req,
  ) {
    await this.memberService.unsubscribeSchoolPage(schoolPageId, req.user.sub);
  }

  @Get('/school-pages/subscribed')
  async getSchoolPagesSubscribed(
    @Query('page') page: number,
    @Query('size') size: number,
    @Request() req,
  ): Promise<PageResponse<SchoolPageResponse>> {
    const schoolPagesSubscribed =
      await this.memberService.findSchoolPagesSubscribed(
        page,
        size,
        req.user.sub,
      );

    return new PageResponse(
      schoolPagesSubscribed[1],
      page,
      size,
      schoolPagesSubscribed[0].map((schoolPageSubscribed) =>
        SchoolPageResponse.create(schoolPageSubscribed.schoolPage),
      ),
    );
  }

  @Get('/school-page-news')
  async getSchoolPageNews(
    @Request() req,
  ): Promise<PageResponse<SchoolPageNewsResponse>> {
    await this.memberService.findSchoolPageNews(req.user.sub);
    return null;
  }
}
