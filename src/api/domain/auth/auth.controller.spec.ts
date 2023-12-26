import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptUtils } from '../../../common/util/bcrypt.util';
import { EncryptUtils } from '../../../common/util/encrypt.util';
import {
  Member,
  MemberRole,
} from '../../../core/db/domain/member/member.entity';
import { API_EXAMPLE } from '../../config/constants';

class MockAuthService {
  login() {}
  signUp() {}
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const createMockMember = async () => {
    const mockMember = new Member();
    mockMember.id = 1;
    mockMember.email = await EncryptUtils.encrypt(API_EXAMPLE.STUDENT_EMAIL);
    mockMember.name = API_EXAMPLE.STUDENT_NAME;
    mockMember.role = MemberRole.STUDENT;
    return mockMember;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('주입확인', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('로그인', async () => {
    const request = new LoginRequest();
    request.email = API_EXAMPLE.STUDENT_EMAIL;
    request.password = API_EXAMPLE.PASSWORD;

    const mockMember = createMockMember();
    jest.spyOn(authService, 'login').mockResolvedValue(mockMember);

    const response = await controller.login(request);
    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
  });

  it('회원가입', async () => {
    const request = new SignUpRequest();
    request.email = API_EXAMPLE.STUDENT_EMAIL;
    request.name = API_EXAMPLE.STUDENT_NAME;
    request.password = API_EXAMPLE.PASSWORD;
    request.role = MemberRole.STUDENT;

    // mock member
    const mockMember = new Member();
    mockMember.id = 1;
    mockMember.name = request.name;
    mockMember.email = await EncryptUtils.encrypt(request.email);
    const { hash } = await BcryptUtils.hash(request.password);
    mockMember.password = hash;
    mockMember.role = request.role;
    mockMember.createdAt = new Date();
    mockMember.updatedAt = new Date();

    jest.spyOn(authService, 'signUp').mockResolvedValue(mockMember);
    const response = await controller.signUp(request);

    expect(response.id).toEqual(mockMember.id);
    expect(response.email).toEqual(
      await EncryptUtils.decrypt(mockMember.email),
    );
    expect(response.name).toEqual(mockMember.name);
    expect(response.role).toEqual(mockMember.role);
    expect(response.createdAt).toEqual(mockMember.createdAt);
  });
});
