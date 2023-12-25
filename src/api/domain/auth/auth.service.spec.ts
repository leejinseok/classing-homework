import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { API_EXAMPLE } from 'src/api/config/constants';
import { Member, MemberRole } from 'src/core/db/domain/member/member.entity';
import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';

class MockRepository {
  findOne(id: number) {
    return Member.createStudentSample();
  }

  save(member: Member) {
    return Member.createStudentSample();
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Member),
          useClass: MockRepository, // MockRepository로 교체
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('로그인', () => {
    it('shoud be response is', async () => {
      const request = new LoginRequest();
      request.email = API_EXAMPLE.STUDENT_EMAIL;
      request.password = API_EXAMPLE.PASSWORD;
      const member = await service.login(request);

      expect(member.email).toBeDefined();
      expect(member.name).toBeDefined();
      expect(member.password).toBeDefined();
      expect(member.role).toEqual(MemberRole.STUDENT);
    });
  });

  describe('회원가입', () => {
    it('shoud be response is', async () => {
      const request = new SignUpRequest();
      request.email = API_EXAMPLE.STUDENT_EMAIL;
      request.name = API_EXAMPLE.STUDENT_NAME;
      request.password = API_EXAMPLE.PASSWORD;
      request.role = MemberRole.STUDENT;

      const member = await service.signUp(request);
      expect(member.email).toBeDefined();
      expect(member.name).toBeDefined();
      expect(member.password).toBeDefined();
      expect(member.role).toBeDefined();
    });
  });
});
