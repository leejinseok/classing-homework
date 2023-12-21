import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MemberModule } from 'src/domain/member/member.module';
import { AuthModule } from 'src/domain/auth/auth.module';

@Module({
  imports: [MemberModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
