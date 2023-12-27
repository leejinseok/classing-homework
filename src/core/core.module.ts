import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
        logging: configService.get('DB_LOGGING'),
        synchronize: configService.get('DB_SYNC'),
        dropSchema: configService.get('DB_DROP_SCHEMA'),
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class CoreModule {}
