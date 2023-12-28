import { Test, TestingModule } from '@nestjs/testing';

import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { API_EXAMPLE } from '../../config/constants';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { SchoolPageRequest } from './dto/school-page.request';
import { SchoolPageController } from './school-page.controller';
import { SchoolPageService } from './school-page.service';
import { CommonStatus } from '../../../core/db/database.common.entity';

class MockSchoolPageService {
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  findSchoolPages = jest.fn();
  findOnlyActiveById = jest.fn();
}

describe('SchoolPageController', () => {
  let controller: SchoolPageController;
  let service: SchoolPageService;
  const authenticated = {
    sub: 1,
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

  it('학교페이지 조회 (목록)', async () => {
    const page = 0;
    const pageSize = 10;

    const schoolPages: SchoolPage[] = [];
    for (let i = 0; i < pageSize; i++) {
      const schoolPage = new SchoolPage();
      schoolPage.id = i;
      schoolPage.schoolName = '학교명';
      schoolPage.region = '서울';
      schoolPage.status = CommonStatus.ACTIVE;
      schoolPage.createdAt = new Date();
      schoolPage.updatedAt = new Date();
      schoolPages.push(schoolPage);
    }
    jest.spyOn(service, 'findSchoolPages').mockResolvedValue([schoolPages, 20]);

    const response = await controller.getSchoolPages(page, pageSize);
    expect(response.page.currentPage).toEqual(page);
    expect(response.page.pageSize).toEqual(pageSize);
    expect(response.page.totalCount).toBeDefined();
    expect(response.page.totalPage).toBeDefined();
    expect(response.list).toBeDefined();

    for (let i = 0; i < pageSize; i++) {
      expect(response.list[i].id).toEqual(schoolPages[i].id);
      expect(response.list[i].schoolName).toEqual(schoolPages[i].schoolName);
      expect(response.list[i].region).toEqual(schoolPages[i].region);
      expect(response.list[i].createdAt).toBeDefined();
      expect(response.list[i].updatedAt).toBeDefined();
    }
  });

  it('학교페이지 조회 (단건)', async () => {
    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.schoolName = '학교명';
    schoolPage.region = '서울';
    schoolPage.status = CommonStatus.ACTIVE;
    schoolPage.createdAt = new Date();
    schoolPage.updatedAt = new Date();

    jest.spyOn(service, 'findOnlyActiveById').mockResolvedValue(schoolPage);

    const response = await controller.getSchoolPage(schoolPage.id);
    expect(response.id).toEqual(schoolPage.id);
    expect(response.schoolName).toEqual(schoolPage.schoolName);
    expect(response.region).toEqual(schoolPage.region);
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });

  it('학교페이지 삭제', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue();
    await controller.deleteSchoolPage(1, authenticated);
  });
});
