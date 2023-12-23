import { Injectable, OnModuleInit } from '@nestjs/common';
import { MemberRole } from 'src/core/db/domain/member/member.entity';
import { AuthService } from './domain/auth/auth.service';
import { SignUpRequest } from './domain/auth/dto/auth.reqeust';
import { SchoolPageService } from './domain/school-page/school-page.service';
import { SchoolPageRequest } from './domain/school-page/dto/school-page.request';
import { SchoolPageNewsService } from './domain/school-page-news/school-page-news.service';
import { SchoolPageNewsRequest } from './domain/school-page-news/dto/school-page-news.request';

@Injectable()
export class ApiApplication implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly schoolPageService: SchoolPageService,
    private readonly schoolPageNewsService: SchoolPageNewsService,
  ) {}

  async onModuleInit() {
    await this.signUp();
  }

  async signUp() {
    const signUpRequest1 = new SignUpRequest();
    signUpRequest1.email = 'test@a.com';
    signUpRequest1.name = 'test';
    signUpRequest1.password = 'test123';
    signUpRequest1.role = MemberRole.ADMIN;
    const adminMember = await this.authService.signUp(signUpRequest1);

    const signUpRequest2 = new SignUpRequest();
    signUpRequest2.email = 'student@a.com';
    signUpRequest2.name = 'student';
    signUpRequest2.password = 'student123';
    signUpRequest2.role = MemberRole.STUDENT;
    this.authService.signUp(signUpRequest2);

    const schoolPage = await this.createSchoolPage(adminMember.id);
    await this.createShoolPageNews(schoolPage.id, adminMember.id);
  }

  createSchoolPage(creatdBy: number) {
    const request = new SchoolPageRequest();
    request.region = '서울';
    request.schoolName = '아무고등학교';
    return this.schoolPageService.save(request, creatdBy);
  }

  createShoolPageNews(schoolPageId: number, createdBy: number) {
    const request = new SchoolPageNewsRequest();
    request.content = '안녕하세요. 학교소식입니다';
    request.schoolPageId = schoolPageId;
    return this.schoolPageNewsService.save(request, createdBy);
  }
}
