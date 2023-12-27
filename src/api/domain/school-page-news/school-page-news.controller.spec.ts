import { Test } from '@nestjs/testing';
import { CommonStatus } from '../../../core/db/database.common.entity';
import {
  Member,
  MemberRole,
} from '../../../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../../../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { JwtPayload } from '../auth/dto/jwt-payload';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from './dto/school-page-news.request';
import { SchoolPageNewsController } from './school-page-news.controller';
import { SchoolPageNewsService } from './school-page-news.service';

class MockSchoolPageNewsService {
  findSchoolPageNewsPage = jest.fn();
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('SchoolPageNewsController', () => {
  let controller: SchoolPageNewsController;
  let service: SchoolPageNewsService;
  const authenticated = {
    sub: 1,
  } as JwtPayload;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SchoolPageNewsController],
      providers: [
        {
          provide: SchoolPageNewsService,
          useClass: MockSchoolPageNewsService,
        },
      ],
    }).compile();

    controller = module.get<SchoolPageNewsController>(SchoolPageNewsController);
    service = module.get<SchoolPageNewsService>(SchoolPageNewsService);
  });

  it('주입확인', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('소식 조회', async () => {
    const schoolPageNewsPage: [SchoolPageNews[], number] = [[], 0];
    const schoolPageNewsList = [];

    const totalCount = 20;
    const page = 0;
    const pageSize = 10;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const createdBy = new Member();
    createdBy.id = 1;

    for (let i = 0; i < pageSize; i++) {
      const item = new SchoolPageNews();
      item.id = i;
      item.content = `아무 내용 ${i}`;
      item.createdBy = createdBy;
      item.schoolPage = schoolPage;
      item.createdAt = new Date();
      item.updatedAt = new Date();
      schoolPageNewsList.push(item);
    }
    schoolPageNewsPage[0] = schoolPageNewsList;
    schoolPageNewsPage[1] = totalCount;

    jest
      .spyOn(service, 'findSchoolPageNewsPage')
      .mockResolvedValue(schoolPageNewsPage);

    const response = await controller.getSchoolNews(
      page,
      pageSize,
      schoolPage.id,
    );

    expect(response.page.currentPage).toEqual(page);
    expect(response.page.pageSize).toEqual(pageSize);
    expect(response.page.totalCount).toEqual(totalCount);
    expect(response.page.totalPage).toEqual(Math.ceil(totalCount / pageSize));
    expect(response.list.length).toEqual(pageSize);
    expect(response.list[0].id).toBeDefined();
    expect(response.list[0].content).toBeDefined();
    expect(response.list[0].schoolPageId).toEqual(schoolPage.id);
    expect(response.list[0].createdAt).toBeDefined();
    expect(response.list[0].updatedAt).toBeDefined();
  });

  it('소식 생성', async () => {
    const author = new Member();
    author.id = 1;
    author.role = MemberRole.ADMIN;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const request = new SchoolPageNewsRequest();
    request.content = '아무소식';
    request.schoolPageId = 1;

    const schoolPageNews = new SchoolPageNews();
    schoolPageNews.id = 1;
    schoolPageNews.content = request.content;
    schoolPageNews.schoolPage = schoolPage;
    schoolPageNews.createdBy = author;
    schoolPageNews.createdAt = new Date();
    schoolPageNews.updatedAt = new Date();

    const req = {
      user: {
        sub: 1,
      },
    };

    jest.spyOn(service, 'save').mockResolvedValue(schoolPageNews);

    const response = await controller.createShoolPageNews(
      request,
      authenticated,
    );
    expect(service.save).toHaveBeenCalledWith(request, req.user.sub);
    expect(response.id).toEqual(schoolPageNews.id);
    expect(response.content).toEqual(schoolPageNews.content);
    expect(response.schoolPageId).toEqual(schoolPageNews.schoolPage.id);
    expect(response.createdAt).toEqual(schoolPageNews.createdAt);
    expect(response.updatedAt).toEqual(schoolPageNews.updatedAt);
  });

  it('소식 수정', async () => {
    const author = new Member();
    author.id = 1;
    author.role = MemberRole.ADMIN;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const schoolPageNews = new SchoolPageNews();
    schoolPageNews.id = 1;
    schoolPageNews.content = '업데이트 전';
    schoolPageNews.createdBy = author;
    schoolPageNews.schoolPage = schoolPage;
    schoolPageNews.status = CommonStatus.ACTIVE;
    schoolPageNews.createdAt = new Date();
    schoolPageNews.updatedAt = new Date();

    const request = new SchoolPageNewsUpdateRequest();
    request.content = '업데이트 후';

    schoolPageNews.content = request.content;

    jest.spyOn(service, 'update').mockResolvedValue(schoolPageNews);

    const req = {
      user: {
        sub: 1,
      },
    };
    const response = await controller.updateSchoolPageNews(
      schoolPageNews.id,
      request,
      authenticated,
    );
    expect(service.update).toHaveBeenCalledWith(
      schoolPageNews.id,
      request,
      req.user.sub,
    );

    expect(response.id).toEqual(schoolPageNews.id);
    expect(response.schoolPageId).toEqual(schoolPageNews.schoolPage.id);
    expect(response.content).toEqual(schoolPageNews.content);
    expect(response.createdAt).toEqual(schoolPageNews.createdAt);
    expect(response.updatedAt).toEqual(schoolPageNews.updatedAt);
  });

  it('소식삭제', async () => {
    jest.spyOn(service, 'delete');
    const schoolPageNewsId = 1;
    const memberId = 1;
    await controller.delete(schoolPageNewsId, authenticated);

    expect(service.delete).toHaveBeenCalledWith(schoolPageNewsId, memberId);
  });
});
