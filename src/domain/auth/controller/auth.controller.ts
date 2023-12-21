import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';
import { SignUpResposne, TokenResponse } from './dto/auth.response';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/config/meta';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) { }

  @Public()
  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<SignUpResposne> {
    const member = await this.authService.signUp(request);
    return SignUpResposne.create(member);
  }

  @Public()
  @Post('/login')
  async login(@Body() request: LoginRequest): Promise<TokenResponse> {
    const member = await this.authService.login(request);

    const { id, name } = member
    const payload = { name }
    const subject = `${id}`

    // accessToken
    const accessToken = await this.jwtService.signAsync(payload, {
      subject,
      expiresIn: '1h'
    })

    // refreshToken
    const refresToken = await this.jwtService.signAsync(payload, {
      subject,
      expiresIn: '15days'
    })

    return TokenResponse.of(accessToken, refresToken);
  }

}
