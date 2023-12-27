import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { MemberRole } from '../../../core/db/domain/member/member.entity';
import { Roles } from '../../config/metadata';
import { ApiResponsePaginated } from '../../config/paginated';
import { Authenticated } from '../auth/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from './dto/school-page-news.request';
import { SchoolPageNewsResponse } from './dto/school-page-news.response';
import { SchoolPageNewsService } from './school-page-news.service';

@ApiTags('학교페이지 소식 (SchoolPage News)')
@ApiBearerAuth()
@Controller('/api/v1/school-page-news')
export class SchoolPageNewsController {
  constructor(private readonly schoolPageNewsService: SchoolPageNewsService) {}

  @ApiOperation({ summary: '소식 조회' })
  @ApiResponsePaginated(SchoolPageNewsResponse)
  @ApiQuery({ name: 'page', example: 0 })
  @ApiQuery({ name: 'size', example: 10 })
  @ApiQuery({
    name: 'schoolPageId',
    example: 1,
    description: '소식을 조회할 학교페이지의 ID',
  })
  @Get()
  async getSchoolNews(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('schoolPageId') schoolPageId: number,
  ): Promise<PageResponse<SchoolPageNewsResponse>> {
    const [list, total] =
      await this.schoolPageNewsService.findSchoolPageNewsPage(
        page,
        size,
        schoolPageId,
      );

    const pageResponse = new PageResponse(
      total,
      +page,
      +size,
      list.map((schoolPageNews) => {
        return SchoolPageNewsResponse.create(schoolPageNews);
      }),
    );

    return pageResponse;
  }

  @ApiOperation({ summary: '소식 생성' })
  @ApiResponse({ type: SchoolPageNewsResponse, status: HttpStatus.CREATED })
  @Roles(MemberRole.ADMIN)
  @Post()
  async createShoolPageNews(
    @Body() schoolPageNewsRequest: SchoolPageNewsRequest,
    @Authenticated() authenticated: JwtPayload,
  ): Promise<SchoolPageNewsResponse> {
    const schoolPageNews = await this.schoolPageNewsService.save(
      schoolPageNewsRequest,
      authenticated.sub,
    );

    return SchoolPageNewsResponse.create(schoolPageNews);
  }

  @ApiOperation({ summary: '소식 수정' })
  @ApiResponse({ type: SchoolPageNewsResponse, status: HttpStatus.OK })
  @ApiParam({
    name: 'schoolPageNewsId',
    example: 1,
    description: '수정할 소식의 ID',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(MemberRole.ADMIN)
  @Patch('/:schoolPageNewsId')
  async updateSchoolPageNews(
    @Param('schoolPageNewsId') schoolPageNewsId: number,
    @Body() schoolPageNewsUpdateRequest: SchoolPageNewsUpdateRequest,
    @Authenticated() authenticated: JwtPayload,
  ): Promise<SchoolPageNewsResponse> {
    const schoolPageNews = await this.schoolPageNewsService.update(
      schoolPageNewsId,
      schoolPageNewsUpdateRequest,
      authenticated.sub,
    );
    return SchoolPageNewsResponse.create(schoolPageNews);
  }

  @ApiOperation({ summary: '소식 삭제' })
  @ApiParam({
    name: 'schoolPageNewsId',
    example: 1,
    description: '삭제할 소식의 ID',
  })
  @Roles(MemberRole.ADMIN)
  @Delete('/:schoolPageNewsId')
  async delete(
    @Param('schoolPageNewsId') schoolPageNewsId: number,
    @Authenticated() authenticated: JwtPayload,
  ) {
    await this.schoolPageNewsService.delete(
      schoolPageNewsId,
      authenticated.sub,
    );
  }
}
