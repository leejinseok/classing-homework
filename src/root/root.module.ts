import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'src/api/api.module';
import { RootController } from './root.controller';

@Module({
  imports: [ConfigModule.forRoot(), ApiModule],
  controllers: [RootController],
})
export class RootModule {}
