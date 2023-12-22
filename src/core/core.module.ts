import { Module } from '@nestjs/common';
import { databaseProviders } from './db/database.providers';
import { memberRepository } from './db/domain/member/member.providers';
import { schoolPageRepository } from './db/domain/school-page/school-page.providers';
import { schoolPageNewsRepository } from './db/domain/school-page-news/school-page-news.providers';

@Module({
  providers: [
    ...databaseProviders,
    memberRepository,
    schoolPageRepository,
    schoolPageNewsRepository,
  ],
  exports: [
    ...databaseProviders,
    memberRepository,
    schoolPageRepository,
    schoolPageNewsRepository,
  ],
})
export class CoreModule {}
