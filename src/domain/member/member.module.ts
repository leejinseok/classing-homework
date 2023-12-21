import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { MemberService } from './service/member.service';
import { MembersController } from './controller/members.controller';
import { memberRepository } from './provider/member.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MembersController],
  providers: [memberRepository, MemberService],
})
export class MemberModule { }
