import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { MemberSchoolPageSubscribe } from '../core/db/domain/member/member-schoolPage-subscribe.entity';
import { Member } from '../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../core/db/domain/school-page/school-page.entity';
import { HelloController } from './common/hello.controller';
import { validationPipe } from './config/validate';
import { AuthController } from './domain/auth/auth.controller';
import { AuthService } from './domain/auth/auth.service';
import { MembersAuthenticatedController } from './domain/member/member.authenticated.controller';
import { MemberService } from './domain/member/member.service';
import { SchoolPageNewsController } from './domain/school-page-news/school-page-news.controller';
import { SchoolPageNewsService } from './domain/school-page-news/school-page-news.service';
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
  return JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_KEY,
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
    HelloController,
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
export class ApiModule {}
