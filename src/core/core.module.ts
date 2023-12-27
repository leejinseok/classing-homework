import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CommonUtils } from '../common/util/common.utils';
import { MemberSchoolPageSubscribe } from './db/domain/member/member-schoolPage-subscribe.entity';
import { Member } from './db/domain/member/member.entity';
import { SchoolPageNews } from './db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from './db/domain/school-page/school-page.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logging = CommonUtils.booleanify(configService.get('DB_LOGGING'));
        const synchronize = CommonUtils.booleanify(
          configService.get('DB_SYNC'),
        );
        const dropSchema = CommonUtils.booleanify(
          configService.get('DB_DROP_SCHEMA'),
        );
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            Member,
            MemberSchoolPageSubscribe,
            SchoolPage,
            SchoolPageNews,
          ],
          logging,
          synchronize,
          dropSchema,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
  ],
})
export class CoreModule {}
