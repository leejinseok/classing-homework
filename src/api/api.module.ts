import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/api/filter/http-exception.filter';
import { CoreModule } from 'src/core/core.module';
import { memberRepository } from 'src/core/domain/member/provider/member.providers';
import { AuthController } from './domain/auth/auth.controller';
import { AuthGuard } from './domain/auth/auth.guard';
import { AuthService } from './domain/auth/auth.service';
import { MemberService } from './domain/member/member.service';
import { MembersController } from './domain/member/members.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './config/constants';
import { ConfigModule } from '@nestjs/config';

const appFilter = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

const authGuard = {
  provide: APP_GUARD,
  useClass: AuthGuard,
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
  controllers: [AuthController, MembersController],
  providers: [
    appFilter,
    authGuard,
    memberRepository,
    AuthService,
    MemberService,
  ],
})
export class ApiModule {}
