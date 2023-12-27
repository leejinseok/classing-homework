import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonStatus } from '../../../core/db/database.common.entity';
import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../../../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from './dto/school-page-news.request';
import { SchoolPageNewsService } from './school-page-news.service';

class MockRepository {
  findOne = jest.fn();
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  createQueryBuilder = jest.fn();
}

describe('SchoolPageNewsService', () => {
  let service: SchoolPageNewsService;
  let schoolPageNewsRepository: Repository<SchoolPageNews>;
  let schoolPageRepository: Repository<SchoolPage>;
  let memberRepository: Repository<Member>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SchoolPageNewsService,
        {
          provide: getRepositoryToken(SchoolPageNews),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(SchoolPage),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: MockRepository,
        },
      ],
    }).compile();
    service = module.get<SchoolPageNewsService>(SchoolPageNewsService);
    schoolPageNewsRepository = module.get<Repository<SchoolPageNews>>(
      getRepositoryToken(SchoolPageNews),
    );

    schoolPageRepository = module.get<Repository<SchoolPage>>(
      getRepositoryToken(SchoolPage),
    );

    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  it('소식 생성', async () => {
    const createdBy = new Member();
    createdBy.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.createdBy = createdBy;

    const request = new SchoolPageNewsRequest();
    request.content = '아무내용';
    request.schoolPageId = schoolPage.id;

    jest
      .spyOn(service, 'findSchoolPageOneOnlyActiveById')
      .mockResolvedValue(schoolPage);

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(createdBy);

    const persist = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(schoolPageNewsRepository, 'save')
      .mockImplementation((entity: SchoolPageNews) => {
        entity.id = persist.id;
        entity.status = CommonStatus.ACTIVE;
        entity.createdAt = persist.createdAt;
        entity.updatedAt = persist.updatedAt;
        return null;
      });

    const result = await service.save(request, createdBy.id);

    expect(service.findSchoolPageOneOnlyActiveById).toHaveBeenCalledWith(
      schoolPage.id,
    );

    expect(memberRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: createdBy.id,
      },
    });

    expect(schoolPageNewsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        content: request.content,
        schoolPage: expect.objectContaining({
          id: schoolPage.id,
        }),
        createdBy: expect.objectContaining({
          id: createdBy.id,
        }),
      }),
    );

    expect(result.id).toEqual(persist.id);
    expect(result.content).toEqual(request.content);
    expect(result.schoolPage.id).toEqual(schoolPage.id);
    expect(result.status).toEqual(CommonStatus.ACTIVE);
    expect(result.createdAt).toEqual(persist.createdAt);
    expect(result.updatedAt).toEqual(persist.updatedAt);
  });

  it('소식 수정', async () => {
    const createdBy = new Member();
    createdBy.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.createdBy = createdBy;

    const schoolPageNews = new SchoolPageNews();
    schoolPageNews.id = 1;
    schoolPageNews.content = '변경 전';
    schoolPageNews.schoolPage = schoolPage;
    schoolPageNews.createdBy = createdBy;
    schoolPageNews.status = CommonStatus.ACTIVE;

    const request = new SchoolPageNewsUpdateRequest();
    request.content = '변경 후';

    jest
      .spyOn(schoolPageNewsRepository, 'findOne')
      .mockResolvedValue(schoolPageNews);

    jest.spyOn(schoolPageNewsRepository, 'update');

    const result = await service.update(
      schoolPageNews.id,
      request,
      createdBy.id,
    );

    expect(schoolPageNewsRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: schoolPageNews.id,
        },
      }),
    );

    expect(schoolPageNewsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: schoolPageNews.id,
        content: request.content,
      }),
    );

    expect(result.id).toEqual(schoolPageNews.id);
    expect(result.content).toBeDefined();
    expect(result.createdBy).toEqual(schoolPageNews.createdBy);
    expect(result.schoolPage).toEqual(schoolPage);
    expect(result.status).toEqual(schoolPageNews.status);
  });

  it('소식 조회', async () => {
    const page = 0;
    const size = 10;
    const schoolPageId = 1;

    jest
      .spyOn(schoolPageNewsRepository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([0, []]),
      } as any);

    const result = await service.findSchoolPageNewsPage(
      page,
      size,
      schoolPageId,
    );

    expect(result[0]).toEqual(0);
    expect(result[1]).toEqual([]);
  });

  it('소식 제거', async () => {
    const createdBy = new Member();
    createdBy.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    schoolPage.status = CommonStatus.ACTIVE;

    const schoolPageNews = new SchoolPageNews();
    schoolPageNews.id = 1;
    schoolPageNews.schoolPage = schoolPage;
    schoolPageNews.createdBy = createdBy;

    jest.spyOn(schoolPageNewsRepository, 'delete');
    jest
      .spyOn(schoolPageNewsRepository, 'findOne')
      .mockResolvedValue(schoolPageNews);
    await service.delete(schoolPageNews.id, 1);

    expect(schoolPageNewsRepository.delete).toHaveBeenCalledWith({
      id: schoolPageNews.id,
    });
  });
});
