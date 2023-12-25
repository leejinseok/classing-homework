import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageResponse } from '../../../common/dto/page.response';
import { ApiResponsePaginated } from '../../config/paginated';
import { SchoolPageNewsWithSchoolPageResponse } from '../school-page-news/dto/school-page-news.response';
import { SchoolPageResponse } from '../school-page/dto/school-page.response';
import { MemberResponse } from './dto/member.response';
import { MemberService } from './member.service';

@ApiTags('인증 사용자 (Member Authenticated)')
@ApiBearerAuth()
@Controller('/api/v1/members/authenticated')
export class MembersAuthenticatedController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '내 정보 요청' })
  @ApiResponse({ type: MemberResponse, status: 200 })
  @Get('/me')
  async getMe(@Request() req): Promise<MemberResponse> {
    const member = await this.memberService.findById(req.user.sub);
    return MemberResponse.create(member);
  }

  @ApiOperation({ summary: '학교페이지 구독' })
  @ApiParam({
    name: 'schoolPageId',
    example: 1,
    description: '구독할 학교페이지 ID',
  })
  @Post('/school-pages/:schoolPageId/subscribe')
  async subscribeSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Request() req,
  ) {
    await this.memberService.subscribeSchoolPage(schoolPageId, req.user.sub);
  }

  @ApiOperation({ summary: '학교페이지 구독 취소' })
  @ApiParam({
    name: 'schoolPageId',
    example: 1,
    description: '구독을 해지할 학교페이지 ID',
  })
  @Patch('/school-pages/:schoolPageId/unsubscribe')
  async unsubscribeSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Request() req,
  ) {
    await this.memberService.unsubscribeSchoolPage(schoolPageId, req.user.sub);
  }

  @ApiOperation({ summary: '구독 중인 학교페이지 목록' })
  @ApiResponsePaginated(SchoolPageResponse)
  @ApiQuery({ name: 'page', example: 0 })
  @ApiQuery({ name: 'size', example: 10 })
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

  @ApiOperation({ summary: '뉴스피드 (타임라인)' })
  @ApiResponsePaginated(SchoolPageNewsWithSchoolPageResponse)
  @ApiQuery({ name: 'page', example: 0 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get('/school-page-news')
  async getSchoolPageNews(
    @Query('page') page: number,
    @Query('size') size: number,
    @Request() req,
  ): Promise<PageResponse<SchoolPageNewsWithSchoolPageResponse>> {
    const schoolPageNews =
      await this.memberService.findSchoolPageNewsSubscribed(req.user.sub);

    return new PageResponse(
      schoolPageNews[1],
      page,
      size,
      schoolPageNews[0].map((schoolPageNews) =>
        SchoolPageNewsWithSchoolPageResponse.create(schoolPageNews),
      ),
    );
  }
}
