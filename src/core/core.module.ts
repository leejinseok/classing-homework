import { Module } from '@nestjs/common';
import { databaseProviders } from './common/database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class CoreModule {}
