import { Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { MemberSchoolPageSubscribe } from '../core/db/domain/member/member-schoolPage-subscribe.entity';
import { Member, MemberRole } from '../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../core/db/domain/school-page/school-page.entity';
import { API_EXAMPLE, JwtConstants } from './config/constants';
import { validationPipe } from './config/validate';
import { AuthController } from './domain/auth/auth.controller';
import { AuthService } from './domain/auth/auth.service';
import { SignUpRequest } from './domain/auth/dto/auth.reqeust';
import { MemberService } from './domain/member/member.service';
import { MembersAuthenticatedController } from './domain/member/members.authenticated.controller';
import { SchoolPageNewsRequest } from './domain/school-page-news/dto/school-page-news.request';
import { SchoolPageNewsController } from './domain/school-page-news/school-page-news.controller';
import { SchoolPageNewsService } from './domain/school-page-news/school-page-news.service';
import { SchoolPageRequest } from './domain/school-page/dto/school-page.request';
import { SchoolPageController } from './domain/school-page/school-page.controller';
import { SchoolPageService } from './domain/school-page/school-page.service';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ValidateExceptionFilter } from './filter/validate-exception.filter';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';

const appFilters = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ValidateExceptionFilter,
  },
];

const appGuards = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];

const jwtModule = () => {
  JwtConstants.secret = process.env.JWT_SECRET_KEY;
  return JwtModule.register({
    global: true,
    secret: JwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  });
};

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      Member,
      MemberSchoolPageSubscribe,
      SchoolPage,
      SchoolPageNews,
    ]),
    jwtModule(),
  ],
  controllers: [
    AuthController,
    MembersAuthenticatedController,
    SchoolPageController,
    SchoolPageNewsController,
  ],
  providers: [
    ...appFilters,
    ...appGuards,
    validationPipe,
    AuthService,
    MemberService,
    SchoolPageService,
    SchoolPageNewsService,
  ],
})
export class ApiModule implements OnModuleInit {
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
