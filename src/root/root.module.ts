import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'src/api/api.module';
import { RootController } from './root.controller';

function getEnvFilePath(env: string) {
  if (env === 'test') {
    return '.env.test';
  }
  return '.env';
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(process.env.NODE_ENV),
    }),
    ApiModule,
  ],
  controllers: [RootController],
})
export class RootModule {}
