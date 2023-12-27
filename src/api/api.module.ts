import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { allExceptionsFilterProvider } from './filter/all-exception.filter';
import { httpExceptionFilterProvider } from './filter/http-exception.filter';
import { validateExceptionFilterProvider } from './filter/validate-exception.filter';
import { authGuardProvider } from './guard/auth.guard';
import { roleGuardProvider } from './guard/roles.guard';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    CoreModule,
    TypeOrmModule.forFeature([
      Member,
      MemberSchoolPageSubscribe,
      SchoolPage,
      SchoolPageNews,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    HelloController,
    AuthController,
    MembersAuthenticatedController,
    SchoolPageController,
    SchoolPageNewsController,
  ],
  providers: [
    Logger,
    allExceptionsFilterProvider,
    httpExceptionFilterProvider,
    validateExceptionFilterProvider,
    authGuardProvider,
    roleGuardProvider,
    validationPipe,
    AuthService,
    MemberService,
    SchoolPageService,
    SchoolPageNewsService,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
