import { Test, TestingModule } from '@nestjs/testing';

import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { API_EXAMPLE } from '../../config/constants';
import { SchoolPageRequest } from './dto/school-page.request';
import { SchoolPageController } from './school-page.controller';
import { SchoolPageService } from './school-page.service';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { DateUtils } from '../../../common/util/data.utils';

class MockSchoolPageService {
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('SchoolPageController', () => {
  let controller: SchoolPageController;
  let service: SchoolPageService;
  const authenticated = {
    sub: 1,
    name: '',
    exp: DateUtils.addHours(new Date(), 1).getTime(),
    iat: new Date().getTime(),
  } as JwtPayload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolPageController],
      providers: [
        {
          provide: SchoolPageService,
          useClass: MockSchoolPageService,
        },
      ],
    }).compile();

    controller = module.get<SchoolPageController>(SchoolPageController);
    service = module.get<SchoolPageService>(SchoolPageService);
  });

  it('주입확인', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('학교페이지 생성', async () => {
    const admin = await Member.createAdminSample();

    const schoolPageMockValue = new SchoolPage();
    schoolPageMockValue.id = 1;
    schoolPageMockValue.schoolName = API_EXAMPLE.SCHOOL_NAME;
    schoolPageMockValue.region = '서울';
    schoolPageMockValue.createdBy = admin;
    schoolPageMockValue.createdAt = new Date();
    schoolPageMockValue.updatedAt = new Date();

    jest.spyOn(service, 'save').mockResolvedValue(schoolPageMockValue);

    const schoolPageRequest = expect.any(SchoolPageRequest);
    const response = await controller.createShoolPage(
      schoolPageRequest,
      authenticated,
    );
    expect(response.id).toEqual(schoolPageMockValue.id);
    expect(response.schoolName).toEqual(schoolPageMockValue.schoolName);
    expect(response.region).toEqual(schoolPageMockValue.region);
    expect(response.createdAt).toEqual(schoolPageMockValue.createdAt);
    expect(response.updatedAt).toEqual(schoolPageMockValue.updatedAt);
  });

  it('학교페이지 수정', async () => {
    const admin = await Member.createAdminSample();

    const schoolPageMockValue = new SchoolPage();
    schoolPageMockValue.id = 1;
    schoolPageMockValue.schoolName = API_EXAMPLE.SCHOOL_NAME;
    schoolPageMockValue.region = '서울';
    schoolPageMockValue.createdBy = admin;
    schoolPageMockValue.createdAt = new Date();
    schoolPageMockValue.updatedAt = new Date();

    const schoolPageRequest = expect.any(SchoolPageRequest);
    jest.spyOn(service, 'update').mockResolvedValue(schoolPageMockValue);

    const response = await controller.updateSchoolPage(
      1,
      schoolPageRequest,
      authenticated,
    );
    expect(response.id).toEqual(schoolPageMockValue.id);
    expect(response.schoolName).toEqual(schoolPageMockValue.schoolName);
    expect(response.region).toEqual(schoolPageMockValue.region);
    expect(response.createdAt).toEqual(schoolPageMockValue.createdAt);
    expect(response.updatedAt).toEqual(schoolPageMockValue.updatedAt);
  });

  it('학교페이지 삭제', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue();
    await controller.deleteSchoolPage(1, authenticated);
  });
});
