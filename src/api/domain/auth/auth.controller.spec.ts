import { Test, TestingModule } from '@nestjs/testing';
import { API_EXAMPLE } from 'src/api/config/constants';
import { EncryptUtils } from 'src/common/util/encrypt.util';
import { Member, MemberRole } from 'src/core/db/domain/member/member.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';

import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

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
      controllers: [AuthController],
    })
      .useMocker(async (token) => {
        if (token === AuthService) {
          return {
            login: jest.fn().mockResolvedValue(createMockMember()),
            signUp: jest.fn().mockResolvedValue(createMockMember()),
          };
        }

        if (token === JwtService) {
          return {
            signAsync: jest.fn().mockResolvedValue('token'),
          };
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('shoud be define', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('shoud response has accessToken, refreshToken', async () => {
      const request = new LoginRequest();
      request.email = API_EXAMPLE.STUDENT_EMAIL;
      request.password = API_EXAMPLE.PASSWORD;

      const response = await controller.login(request);
      console.log(response);
      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });
  });

  describe('signUp', () => {
    it('shoud response is', async () => {
      const request = new SignUpRequest();
      request.email = API_EXAMPLE.STUDENT_EMAIL;
      request.password = API_EXAMPLE.PASSWORD;

      const response = await controller.signUp(request);
      expect(response.id).toEqual(1);
      expect(response.email).toEqual(API_EXAMPLE.STUDENT_EMAIL);
      expect(response.name).toEqual(API_EXAMPLE.STUDENT_NAME);
      expect(response.role).toEqual(MemberRole.STUDENT);
    });
  });
});
