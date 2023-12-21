import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/config/constants';
import { HttpExceptionFilter } from 'src/config/filter/http-exception.filter';
import { AuthModule } from 'src/domain/auth/auth.module';
import { AuthGuard } from 'src/domain/auth/guard/auth.guard';
import { MemberModule } from 'src/domain/member/member.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  imports: [
    ConfigModule.forRoot(),
    MemberModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })],
  controllers: [AppController],
})
export class AppModule { }
