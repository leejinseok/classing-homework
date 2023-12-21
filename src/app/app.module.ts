import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/config/filter/all-exception.filter';
import { HttpExceptionFilter } from 'src/config/filter/http-exception.filter';
import { AuthModule } from 'src/domain/auth/auth.module';
import { MemberModule } from 'src/domain/member/member.module';
import { AppController } from './app.controller';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  imports: [MemberModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
