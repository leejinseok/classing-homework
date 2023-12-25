import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'classting_homework',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class CoreModule {}
