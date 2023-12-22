import { Module } from '@nestjs/common';
import { databaseProviders } from './db/database.providers';
import {
  memberSchoolPageSubscribeRepository,
  memberRepository,
} from './db/domain/member/member.providers';
import { schoolPageNewsRepository } from './db/domain/school-page-news/school-page-news.providers';
import { schoolPageRepository } from './db/domain/school-page/school-page.providers';

@Module({
  providers: [
    ...databaseProviders,
    memberRepository,
    memberSchoolPageSubscribeRepository,
    schoolPageRepository,
    schoolPageNewsRepository,
  ],
  exports: [
    ...databaseProviders,
    memberRepository,
    memberSchoolPageSubscribeRepository,
    schoolPageRepository,
    schoolPageNewsRepository,
  ],
})
export class CoreModule {}
