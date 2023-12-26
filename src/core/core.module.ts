import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MemberSchoolPageSubscribe } from './db/domain/member/member-schoolPage-subscribe.entity';
import { Member } from './db/domain/member/member.entity';
import { SchoolPageNews } from './db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from './db/domain/school-page/school-page.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Member, MemberSchoolPageSubscribe, SchoolPage, SchoolPageNews],
      logging: process.env.DB_LOGGING === 'true',
      dropSchema: process.env.DB_DROP_SCHEME === 'true',
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class CoreModule {}
