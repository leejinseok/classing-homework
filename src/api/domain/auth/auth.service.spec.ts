import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Member,
  MemberRole,
} from '../../../core/db/domain/member/member.entity';
import { API_EXAMPLE } from '../../config/constants';
import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';
import { Repository } from 'typeorm';
import { EncryptUtils } from '../../../common/util/encrypt.util';
import { BcryptUtils } from '../../../common/util/bcrypt.util';

class MockRepository {
  findOne = jest.fn();
  save = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Member>;

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
    repository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('주입확인', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('로그인', async () => {
    const request = new LoginRequest();
    request.email = API_EXAMPLE.STUDENT_EMAIL;
    request.password = API_EXAMPLE.PASSWORD;

    const member = new Member();
    member.id = 1;
    member.name = API_EXAMPLE.STUDENT_NAME;
    member.email = await EncryptUtils.encrypt(request.email);
    const { hash } = await BcryptUtils.hash(request.password);
    member.password = hash;
    member.role = MemberRole.STUDENT;
    member.createdAt = new Date();
    member.updatedAt = new Date();

    jest.spyOn(repository, 'findOne').mockResolvedValue(member);
    const reuslt = await service.login(request);

    expect(reuslt.id).toEqual(member.id);
    expect(await EncryptUtils.decrypt(reuslt.email)).toEqual(request.email);
    expect(reuslt.name).toEqual(member.name);
    expect(reuslt.role).toEqual(member.role);
    expect(reuslt.createdAt).toBeDefined();
    expect(reuslt.updatedAt).toBeDefined();
  });

  it('회원가입', async () => {
    const request = new SignUpRequest();
    request.email = API_EXAMPLE.STUDENT_EMAIL;
    request.name = API_EXAMPLE.STUDENT_NAME;
    request.password = API_EXAMPLE.PASSWORD;
    request.role = MemberRole.STUDENT;

    jest.spyOn(repository, 'save').mockImplementation((entity: Member) => {
      entity.id = 1;
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      return null;
    });
    const member = await service.signUp(request);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...request,
      }),
    );

    expect(await EncryptUtils.decrypt(member.email)).toEqual(
      API_EXAMPLE.STUDENT_EMAIL,
    );
    expect(member.id).toEqual(1);
    expect(member.name).toEqual(request.name);
    expect(member.password).toBeDefined();
    expect(member.role).toEqual(request.role);
    expect(member.createdAt).toBeDefined();
    expect(member.updatedAt).toBeDefined();
  });
});
