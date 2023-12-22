import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/api/filter/http-exception.filter';
import { CoreModule } from 'src/core/core.module';
import { JwtConstants } from './config/constants';
import { AuthController } from './domain/auth/auth.controller';
import { AuthGuard } from './domain/auth/auth.guard';
import { AuthService } from './domain/auth/auth.service';
import { RolesGuard } from './domain/auth/roles.guard';
import { MemberService } from './domain/member/member.service';
import { MembersController } from './domain/member/members.controller';
import { SchoolPageNewsController } from './domain/school-page-news/school-page-news.controller';
import { SchoolPageNewsService } from './domain/school-page-news/school-page-news.service';
import { SchoolPageController } from './domain/school-page/school-page.controller';
import { SchoolPageService } from './domain/school-page/school-page.service';

const appFilter = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

const authGuard = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};

const rolesGuard = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};

const jwtModule = () => {
  JwtConstants.secret = process.env.JWT_SECRET_KEY;
  return JwtModule.register({
    global: true,
    secret: JwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  });
};

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, jwtModule()],
  controllers: [
    AuthController,
    MembersController,
    SchoolPageController,
    SchoolPageNewsController,
  ],
  providers: [
    appFilter,
    authGuard,
    rolesGuard,
    AuthService,
    MemberService,
    SchoolPageService,
    SchoolPageNewsService,
  ],
})
export class ApiModule {}
