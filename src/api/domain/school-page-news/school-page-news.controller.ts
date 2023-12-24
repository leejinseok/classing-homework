import {
  Body,
  Controller,
  Delete,
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
import { Roles } from 'src/api/config/metadata';
import { ApiResponsePaginated } from 'src/api/config/paginated';
import { PageResponse } from 'src/common/dto/page.response';
import { MemberRole } from 'src/core/db/domain/member/member.entity';
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

  @ApiOperation({ summary: '학교페이지 소식 조회' })
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
    const schoolPageNews = await this.schoolPageNewsService.findSchoolPageNews(
      page,
      size,
      schoolPageId,
    );

    const pageResponse = new PageResponse(
      schoolPageNews[1],
      page,
      size,
      schoolPageNews[0].map((schoolPageNews) => {
        return SchoolPageNewsResponse.create(schoolPageNews);
      }),
    );

    return pageResponse;
  }

  @ApiOperation({ summary: '소식 생성' })
  @ApiResponse({ type: SchoolPageNewsResponse, status: 201 })
  @Roles(MemberRole.ADMIN)
  @Post()
  async createShoolPageNews(
    @Body() schoolPageNewsRequest: SchoolPageNewsRequest,
    @Request() req,
  ): Promise<SchoolPageNewsResponse> {
    const user: JwtPayload = req.user;
    const schoolPageNews = await this.schoolPageNewsService.save(
      schoolPageNewsRequest,
      user.sub,
    );

    return SchoolPageNewsResponse.create(schoolPageNews);
  }

  @ApiOperation({ summary: '소식 수정' })
  @ApiResponse({ type: SchoolPageNewsResponse, status: 200 })
  @ApiParam({
    name: 'schoolPageNewsId',
    example: 1,
    description: '수정할 소식의 ID',
  })
  @Roles(MemberRole.ADMIN)
  @Patch('/:schoolPageNewsId')
  async updateSchoolPageNews(
    @Param('schoolPageNewsId') schoolPageNewsId: number,
    @Body() schoolPageNewsUpdateRequest: SchoolPageNewsUpdateRequest,
    @Request() req,
  ): Promise<SchoolPageNewsResponse> {
    const user: JwtPayload = req.user;
    const schoolPageNews = await this.schoolPageNewsService.update(
      schoolPageNewsId,
      schoolPageNewsUpdateRequest,
      user.sub,
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
    @Request() req,
  ) {
    const user: JwtPayload = req.user;
    await this.schoolPageNewsService.delete(schoolPageNewsId, user.sub);
  }
}
