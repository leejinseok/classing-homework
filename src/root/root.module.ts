import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'src/api/api.module';
import { AppController } from './root.controller';

@Module({
  imports: [ConfigModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [],
})
export class RootModule {}
