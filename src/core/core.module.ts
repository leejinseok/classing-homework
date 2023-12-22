import { Module } from '@nestjs/common';
import { databaseProviders } from './db/database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class CoreModule {}
