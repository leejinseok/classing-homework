import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonStatus } from '../../../core/db/database.common.entity';
import { MemberSchoolPageSubscribe } from '../../../core/db/domain/member/member-schoolPage-subscribe.entity';
import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../../../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { MemberService } from './member.service';
import { sign } from 'crypto';

class MockRepository {
  findOne = jest.fn();
  save = jest.fn();
  createQueryBuilder = jest.fn();
  update = jest.fn();
}

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: Repository<Member>;
  let memberSchoolPageSubscribeRepository: Repository<MemberSchoolPageSubscribe>;
  let schoolPageRepository: Repository<SchoolPage>;
  let schoolPageNewsRepository: Repository<SchoolPageNews>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(MemberSchoolPageSubscribe),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(SchoolPage),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(SchoolPageNews),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    memberSchoolPageSubscribeRepository = module.get<
      Repository<MemberSchoolPageSubscribe>
    >(getRepositoryToken(MemberSchoolPageSubscribe));

    schoolPageRepository = module.get<Repository<SchoolPage>>(
      getRepositoryToken(SchoolPage),
    );

    schoolPageNewsRepository = module.get<Repository<SchoolPageNews>>(
      getRepositoryToken(SchoolPageNews),
    );
  });

  it('학교페이지 구독', async () => {
    const me = new Member();
    me.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    jest.spyOn(schoolPageRepository, 'findOne').mockResolvedValue(schoolPage);

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(me);

    jest
      .spyOn(memberSchoolPageSubscribeRepository, 'createQueryBuilder')
      .mockReturnValueOnce({
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      } as any);

    jest.spyOn(memberSchoolPageSubscribeRepository, 'save');

    await service.subscribeSchoolPage(schoolPage.id, me.id);
    expect(schoolPageRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: schoolPage.id,
      },
    });

    expect(memberRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: me.id,
      },
    });
  });

  it('학교페이지 구독취소', async () => {
    const me = new Member();
    me.id = 1;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const subscribe = new MemberSchoolPageSubscribe();
    subscribe.id = 1;
    subscribe.member = me;
    subscribe.status = CommonStatus.ACTIVE;

    jest
      .spyOn(memberSchoolPageSubscribeRepository, 'createQueryBuilder')
      .mockReturnValueOnce({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(subscribe),
      } as any);

    jest.spyOn(memberSchoolPageSubscribeRepository, 'update');
    await service.unsubscribeSchoolPage(schoolPage.id, me.id);

    expect(memberSchoolPageSubscribeRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: subscribe.id,
      }),
      expect.objectContaining({
        status: subscribe.status,
      }),
    );
  });

  it('구독 중인 학교페이지 목록', async () => {
    const me = new Member();
    me.id = 1;

    const total = 20;
    const page = 0;
    const size = 10;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const memberShoolPageSubscribedList: MemberSchoolPageSubscribe[] = [];
    for (let i = 0; i < size; i++) {
      const subscribe = new MemberSchoolPageSubscribe();
      subscribe.id = 1;
      subscribe.schoolPage = schoolPage;
      subscribe.member = me;
      subscribe.status = CommonStatus.ACTIVE;
      subscribe.createdAt = new Date();
      subscribe.updatedAt = new Date();
      memberShoolPageSubscribedList.push(subscribe);
    }

    jest
      .spyOn(memberSchoolPageSubscribeRepository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([memberShoolPageSubscribedList, total]),
      } as any);

    const result = await service.findSchoolPagesSubscribed(page, size, me.id);
    expect(result[0].length).toEqual(size);

    for (let i = 0; i < size; i++) {
      expect(result[0][i].id).toEqual(memberShoolPageSubscribedList[i].id);
      expect(result[0][i].member).toEqual(
        memberShoolPageSubscribedList[i].member,
      );
      expect(result[0][i].schoolPage).toEqual(
        memberShoolPageSubscribedList[i].schoolPage,
      );
      expect(result[0][i].status).toEqual(
        memberShoolPageSubscribedList[i].status,
      );
      expect(result[0][i].createdAt).toEqual(
        memberShoolPageSubscribedList[i].createdAt,
      );
      expect(result[0][i].updatedAt).toEqual(
        memberShoolPageSubscribedList[i].updatedAt,
      );
    }

    expect(result[1]).toEqual(total);
  });

  it('뉴스피드 (타임라인)', async () => {
    const me = new Member();
    me.id = 1;

    const total = 20;
    const pageSize = 10;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const schoolPageNewsList: SchoolPageNews[] = [];
    for (let i = 0; i < pageSize; i++) {
      const schoolPageNews = new SchoolPageNews();
      schoolPageNews.id = 1;
      schoolPageNews.content = '내용';
      schoolPageNews.status = CommonStatus.ACTIVE;
      schoolPageNews.createdBy = me;
      schoolPageNews.schoolPage = schoolPage;
      schoolPageNews.createdAt = new Date();
      schoolPageNews.updatedAt = new Date();
      schoolPageNewsList.push(schoolPageNews);
    }

    jest
      .spyOn(schoolPageNewsRepository, 'createQueryBuilder')
      .mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([schoolPageNewsList, total]),
      } as any);

    const result = await service.findSchoolPageNewsSubscribed(me.id);
    const list = result[0];
    expect(list.length).toEqual(pageSize);

    for (let i = 0; i < pageSize; i++) {
      expect(list[i].id).toEqual(schoolPageNewsList[i].id);
      expect(list[i].content).toEqual(schoolPageNewsList[i].content);
      expect(list[i].schoolPage).toEqual(schoolPageNewsList[i].schoolPage);
      expect(list[i].createdBy).toEqual(schoolPageNewsList[i].createdBy);
      expect(list[i].status).toEqual(schoolPageNewsList[i].status);
      expect(list[i].createdAt).toEqual(schoolPageNewsList[i].createdAt);
      expect(list[i].updatedAt).toEqual(schoolPageNewsList[i].updatedAt);
    }

    expect(result[1]).toEqual(total);
  });
});
