import { Body, Controller, Post, Request } from '@nestjs/common';
import { SchoolPageService } from './school-page.service';
import { SchoolPageRequest } from './dto/school-page.request';
import { Roles } from 'src/api/config/metadata';
import { MemberRole } from 'src/core/db/domain/member/entity/member.entity';
import { SchoolPageResponse } from './dto/school-page.response';

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
      req.user.id,
    );

    return SchoolPageResponse.create(schoolPage);
  }
}
