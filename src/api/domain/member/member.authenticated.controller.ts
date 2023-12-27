import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { Authenticated } from '../auth/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload';
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
  @ApiResponse({ type: MemberResponse, status: HttpStatus.OK })
  @Get('/me')
  async getMe(
    @Authenticated() authenticated: JwtPayload,
  ): Promise<MemberResponse> {
    const member = await this.memberService.findById(authenticated.sub);
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
    @Authenticated() authenticated: JwtPayload,
  ) {
    await this.memberService.subscribeSchoolPage(
      schoolPageId,
      authenticated.sub,
    );
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
    @Authenticated() authenticated: JwtPayload,
  ) {
    await this.memberService.unsubscribeSchoolPage(
      schoolPageId,
      authenticated.sub,
    );
  }

  @ApiOperation({ summary: '구독 중인 학교페이지 목록' })
  @ApiResponsePaginated(SchoolPageResponse)
  @ApiQuery({ name: 'page', example: 0 })
  @ApiQuery({ name: 'size', example: 10 })
  @Get('/school-pages/subscribed')
  async getSchoolPagesSubscribed(
    @Query('page') page: number,
    @Query('size') size: number,
    @Authenticated() authenticated: JwtPayload,
  ): Promise<PageResponse<SchoolPageResponse>> {
    const [list, total] = await this.memberService.findSchoolPagesSubscribed(
      page,
      size,
      authenticated.sub,
    );

    return new PageResponse(
      total,
      +page,
      +size,
      list.map((schoolPageSubscribed) =>
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
    @Authenticated() authenticated: JwtPayload,
  ): Promise<PageResponse<SchoolPageNewsWithSchoolPageResponse>> {
    const [list, total] = await this.memberService.findSchoolPageNewsSubscribed(
      authenticated.sub,
    );

    return new PageResponse(
      total,
      page,
      size,
      list.map((schoolPageNews) =>
        SchoolPageNewsWithSchoolPageResponse.create(schoolPageNews),
      ),
    );
  }
}
