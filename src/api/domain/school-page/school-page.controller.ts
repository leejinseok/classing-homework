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
import { MemberRole } from '../../../core/db/domain/member/member.entity';
import { Roles } from '../../config/metadata';
import { Authenticated } from '../auth/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { SchoolPageRequest } from './dto/school-page.request';
import { SchoolPageResponse } from './dto/school-page.response';
import { SchoolPageService } from './school-page.service';
import { ApiResponsePaginated } from '../../config/paginated';
import { PageResponse } from '../../../common/dto/page.response';

@ApiTags('학교페이지 (SchoolPage)')
@ApiBearerAuth()
@Controller('/api/v1/school-pages')
export class SchoolPageController {
  constructor(private readonly schoolPageService: SchoolPageService) {}

  @ApiOperation({ summary: '학교페이지 생성 (관리자만)' })
  @ApiResponse({ type: SchoolPageResponse, status: HttpStatus.CREATED })
  @Roles(MemberRole.ADMIN)
  @Post()
  async createShoolPage(
    @Body() schoolPageRequest: SchoolPageRequest,
    @Authenticated() authenticated: JwtPayload,
  ): Promise<SchoolPageResponse> {
    const schoolPage = await this.schoolPageService.save(
      schoolPageRequest,
      authenticated.sub,
    );

    return SchoolPageResponse.create(schoolPage);
  }

  @ApiOperation({ summary: '학교페이지 수정 (관리자만)' })
  @ApiResponse({ type: SchoolPageResponse, status: HttpStatus.CREATED })
  @ApiParam({
    name: 'schoolPageId',
    example: 1,
    description: '수정할 학교페이지 ID',
  })
  @Roles(MemberRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch('/:schoolPageId')
  async updateSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Body() schoolPageRequest: SchoolPageRequest,
    @Authenticated() authenticated: JwtPayload,
  ): Promise<SchoolPageResponse> {
    const schoolPage = await this.schoolPageService.update(
      schoolPageRequest,
      schoolPageId,
      authenticated.sub,
    );
    return SchoolPageResponse.create(schoolPage);
  }

  @ApiOperation({ summary: '학교페이지 조회 (목록)' })
  @ApiResponsePaginated(SchoolPageResponse)
  @ApiQuery({ name: 'page', example: 0 })
  @ApiQuery({ name: 'size', example: 10 })
  @Roles(MemberRole.ADMIN)
  @Get()
  async getSchoolPages(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    const [list, total] = await this.schoolPageService.findSchoolPages(
      page,
      size,
    );

    return new PageResponse(
      total,
      +page,
      +size,
      list.map((schoolPage) => SchoolPageResponse.create(schoolPage)),
    );
  }

  @ApiOperation({ summary: '학교페이지 조회 (단건)' })
  @ApiResponsePaginated(SchoolPageResponse)
  @Roles(MemberRole.ADMIN)
  @Get('/:schoolPageId')
  async getSchoolPage(@Param('schoolPageId') schoolPageId: number) {
    const schoolPage =
      await this.schoolPageService.findOnlyActiveById(schoolPageId);

    return SchoolPageResponse.create(schoolPage);
  }

  @ApiOperation({ summary: '학교페이지 삭제 (관리자만)' })
  @ApiParam({
    name: 'schoolPageId',
    example: 1,
    description: '삭제할 학교페이지 ID',
  })
  @Roles(MemberRole.ADMIN)
  @Delete('/:schoolPageId')
  async deleteSchoolPage(
    @Param('schoolPageId') schoolPageId: number,
    @Authenticated() authenticated: JwtPayload,
  ) {
    await this.schoolPageService.delete(schoolPageId, authenticated.sub);
  }
}
