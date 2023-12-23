import { Injectable, OnModuleInit } from '@nestjs/common';
import { MemberRole } from 'src/core/db/domain/member/member.entity';
import { API_EXAMPLE } from './config/constants';
import { AuthService } from './domain/auth/auth.service';
import { SignUpRequest } from './domain/auth/dto/auth.reqeust';
import { SchoolPageNewsRequest } from './domain/school-page-news/dto/school-page-news.request';
import { SchoolPageNewsService } from './domain/school-page-news/school-page-news.service';
import { SchoolPageRequest } from './domain/school-page/dto/school-page.request';
import { SchoolPageService } from './domain/school-page/school-page.service';

@Injectable()
export class ApiApplication implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly schoolPageService: SchoolPageService,
    private readonly schoolPageNewsService: SchoolPageNewsService,
  ) {}

  async onModuleInit() {
    // 관리자 계정 생성
    const adminMemberRequest = new SignUpRequest();
    adminMemberRequest.email = API_EXAMPLE.ADMIN_NAME;
    adminMemberRequest.name = API_EXAMPLE.ADMIN_NAME;
    adminMemberRequest.password = API_EXAMPLE.PASSWORD;
    adminMemberRequest.role = MemberRole.ADMIN;
    const adminMember = await this.authService.signUp(adminMemberRequest);

    // 학생 계정 생성
    const studentMember = new SignUpRequest();
    studentMember.email = API_EXAMPLE.STUDENT_EMAIL;
    studentMember.name = API_EXAMPLE.STUDENT_NAME;
    studentMember.password = API_EXAMPLE.PASSWORD;
    studentMember.role = MemberRole.STUDENT;
    await this.authService.signUp(studentMember);

    // 학교페이지 생성
    const schoolPageRequest = new SchoolPageRequest();
    schoolPageRequest.region = '서울';
    schoolPageRequest.schoolName = API_EXAMPLE.SCHOOL_NAME;
    const schoolPage = await this.schoolPageService.save(
      schoolPageRequest,
      adminMember.id,
    );

    // 학교페이지 소식 생성
    const request = new SchoolPageNewsRequest();
    request.content = API_EXAMPLE.SCHOOL_PAGE_NEWS_CONTENT;
    request.schoolPageId = schoolPage.id;
    return this.schoolPageNewsService.save(request, adminMember.id);
  }
}
