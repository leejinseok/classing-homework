import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonStatus } from '../../../core/db/database.common.entity';
import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { API_EXAMPLE } from '../../config/constants';
import { SchoolPageRequest } from './dto/school-page.request';
import { SchoolPageService } from './school-page.service';

class MockSchoolPageRepository {
  save() {}
  async update() {}
}
class MockMemberRepository {
  findOne() {}
}

describe('SchoolPageService ', () => {
  let service: SchoolPageService;
  let schoolPageRepository: Repository<SchoolPage>;
  let memberRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolPageService],
      providers: [
        {
          provide: getRepositoryToken(SchoolPage),
          useClass: MockSchoolPageRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: MockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolPageService>(SchoolPageService);
    schoolPageRepository = module.get<Repository<SchoolPage>>(
      getRepositoryToken(SchoolPage),
    );
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  it('주입확인', () => {
    expect(service).toBeDefined();
    expect(schoolPageRepository).toBeDefined();
    expect(memberRepository).toBeDefined();
  });

  it('학교페이지 생성', async () => {
    const admin = new Member();
    admin.id = 1;

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(admin);

    const schoolPageRequest = new SchoolPageRequest();
    schoolPageRequest.schoolName = API_EXAMPLE.SCHOOL_NAME;
    schoolPageRequest.region = '서울';

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.schoolName = schoolPageRequest.schoolName;
    schoolPage.region = schoolPageRequest.region;

    jest.spyOn(schoolPageRepository, 'save').mockResolvedValue(schoolPage);
    const result = await service.save(schoolPageRequest, admin.id);

    expect(result).toBeDefined();
    expect(schoolPageRepository.save).toHaveBeenCalledWith(
      expect.any(SchoolPage),
    );
  });

  it('학교페이지 수정', async () => {
    const createdBy = new Member();
    createdBy.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.schoolName = API_EXAMPLE.SCHOOL_NAME;
    schoolPage.region = '서울';
    schoolPage.createdBy = createdBy;

    jest.spyOn(service, 'findOnlyActiveById').mockResolvedValue(schoolPage);

    const request = new SchoolPageRequest();
    request.schoolName = '변경 된 학교명';
    request.region = '변경 된 지역';

    const result = await service.update(request, schoolPage.id, createdBy.id);
    expect(result.schoolName).toEqual(request.schoolName);
    expect(result.region).toEqual(request.region);
  });

  it('학교페이지 삭제', async () => {
    const createdBy = new Member();
    createdBy.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.createdBy = createdBy;

    jest.spyOn(service, 'findOnlyActiveById').mockResolvedValue(schoolPage);
    jest.spyOn(schoolPageRepository, 'update');
    await service.delete(schoolPage.id, createdBy.id);

    expect(schoolPageRepository.update).toHaveBeenCalledWith(
      {
        id: schoolPage.id,
      },
      {
        status: CommonStatus.DELETED,
      },
    );
  });
});
