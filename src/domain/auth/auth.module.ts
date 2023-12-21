import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { memberRepository } from '../member/provider/member.providers';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [memberRepository, AuthService],
})
export class AuthModule { }
