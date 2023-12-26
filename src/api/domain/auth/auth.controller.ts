import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../config/metadata';
import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';
import { SignUpResposne, TokenResponse } from './dto/auth.response';

@ApiTags('인증 (Auth)')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ type: SignUpResposne, status: 201 })
  @Public()
  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<SignUpResposne> {
    const member = await this.authService.signUp(request);
    return await SignUpResposne.create(member);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ type: TokenResponse, status: 200 })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() request: LoginRequest): Promise<TokenResponse> {
    const member = await this.authService.login(request);

    const { id, name, role } = member;
    const payload = { name, role };
    const subject = `${id}`;

    // accessToken
    const accessToken = await this.jwtService.signAsync(payload, {
      subject,
      expiresIn: '1h',
    });

    // refreshToken
    const refresToken = await this.jwtService.signAsync(payload, {
      subject,
      expiresIn: '15days',
    });

    return TokenResponse.of(accessToken, refresToken);
  }
}
