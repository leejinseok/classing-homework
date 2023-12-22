import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Roles } from 'src/api/config/metadata';
import { MemberRole } from 'src/core/db/domain/member/member.entity';
import { JwtPayload } from '../auth/dto/jwt-payload';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from './dto/school-page-news.request';
import { SchoolPageNewsResponse } from './dto/school-page-news.response';
import { SchoolPageNewsService } from './school-page-news.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SchoolPage News (학교페이지 소식)')
@Controller('/api/v1/school-page-news')
export class SchoolPageNewsController {
  constructor(private readonly schoolPageNewsService: SchoolPageNewsService) {}

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
