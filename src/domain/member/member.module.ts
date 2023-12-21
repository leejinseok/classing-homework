import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { memberProviders } from './provider/member.providers';
import { MemberService } from './service/member.service';
import { MembersController } from './controller/member.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MembersController],
  providers: [...memberProviders, MemberService],
})
export class MemberModule {}
