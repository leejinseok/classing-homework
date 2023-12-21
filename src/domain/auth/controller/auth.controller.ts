import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';
import { SignUpResposne } from './dto/auth.response';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<SignUpResposne> {
    const member = await this.authService.signUp(request);
    return SignUpResposne.create(member);
  }

  @Post('/login')
  async login(@Body() request: LoginRequest): Promise<any> {
    const member = await this.authService.login(request);
    return null;
  }
}
