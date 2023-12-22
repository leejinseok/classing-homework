import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { SchoolPageService } from './school-page.service';
import { SchoolPageRequest } from './dto/school-page.request';
import { Roles } from 'src/api/config/metadata';
import { MemberRole } from 'src/core/db/domain/member/member.entity';
import { SchoolPageResponse } from './dto/school-page.response';
import { JwtPayload } from '../auth/dto/jwt-payload';

@Controller('/api/v1/school-pages')
export class SchoolPageController {
  constructor(private readonly schoolPageService: SchoolPageService) {}

  @Roles(MemberRole.ADMIN)
  @Post()
  async createShoolPage(
    @Body() schoolPageRequest: SchoolPageRequest,
    @Request() req,
  ): Promise<SchoolPageResponse> {
    const schoolPage = await this.schoolPageService.save(
      schoolPageRequest,
      req.user.sub,
    );

    return SchoolPageResponse.create(schoolPage);
  }

  @Roles(MemberRole.ADMIN)
  @Patch('/:schoolPageId')
  async updateSchoolPage(
    @Param('schoolPageId') schoolPageId: bigint,
    @Body() schoolPageRequest: SchoolPageRequest,
    @Request() req,
  ): Promise<SchoolPageResponse> {
    const user: JwtPayload = req.user;
    const schoolPage = await this.schoolPageService.update(
      schoolPageRequest,
      schoolPageId,
      user.sub,
    );
    return SchoolPageResponse.create(schoolPage);
  }

  @Roles(MemberRole.ADMIN)
  @Delete('/:schoolPageId')
  async deleteSchoolPage(
    @Param('schoolPageId') schoolPageId: bigint,
    @Request() req,
  ) {
    const user: JwtPayload = req.user;
    await this.schoolPageService.delete(schoolPageId, user.sub);
  }
}
