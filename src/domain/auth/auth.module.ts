import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { DatabaseModule } from 'src/config/database/database.module';
import { memberProviders } from '../member/provider/member.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...memberProviders, AuthService],
})
export class AuthModule {}
