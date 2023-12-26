import { Test } from '@nestjs/testing';
import { BcryptUtils } from '../../../common/util/bcrypt.util';
import { EncryptUtils } from '../../../common/util/encrypt.util';
import { MemberSchoolPageSubscribe } from '../../../core/db/domain/member/member-schoolPage-subscribe.entity';
import {
  Member,
  MemberRole,
} from '../../../core/db/domain/member/member.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { API_EXAMPLE } from '../../config/constants';
import { MemberService } from './member.service';
import { MembersAuthenticatedController } from './members.authenticated.controller';
import { SchoolPageNews } from '../../../core/db/domain/school-page-news/school-page-news.entity';

class MockMemberService {
  findById = jest.fn();
  subscribeSchoolPage = jest.fn();
  unsubscribeSchoolPage = jest.fn();
  findSchoolPagesSubscribed = jest.fn();
  findSchoolPageNewsSubscribed = jest.fn();
}

describe('MemberAuthenticatedControllerTest', () => {
  let controller: MembersAuthenticatedController;
  let memberService: MemberService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MembersAuthenticatedController],
      providers: [
        {
          provide: MemberService,
          useClass: MockMemberService,
        },
      ],
    }).compile();

    controller = module.get<MembersAuthenticatedController>(
      MembersAuthenticatedController,
    );
    memberService = module.get<MemberService>(MemberService);
  });

  it('주입확인', () => {
    expect(controller).toBeDefined();
    expect(memberService).toBeDefined();
  });

  it('내 정보 요청', async () => {
    const me = new Member();
    me.id = 1;
    me.email = await EncryptUtils.encrypt(API_EXAMPLE.STUDENT_EMAIL);
    me.name = API_EXAMPLE.STUDENT_NAME;
    const { hash } = await BcryptUtils.hash(API_EXAMPLE.PASSWORD);
    me.password = hash;
    me.role = MemberRole.STUDENT;
    me.createdAt = new Date();
    me.updatedAt = new Date();

    jest.spyOn(memberService, 'findById').mockResolvedValue(me);
    const response = await controller.getMe({ user: { sub: me.id } });
    expect(memberService.findById).toHaveBeenCalledWith(me.id);
    expect(response.id).toEqual(me.id);
    expect(response.email).toEqual(API_EXAMPLE.STUDENT_EMAIL);
    expect(response.name).toEqual(API_EXAMPLE.STUDENT_NAME);
    expect(response.role).toEqual(me.role);
    expect(response.createdAt).toEqual(me.createdAt);
    expect(response.updatedAt).toEqual(me.updatedAt);
  });

  it('학교페이지 구독', async () => {
    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const req = {
      user: {
        sub: 1,
      },
    };

    jest.spyOn(memberService, 'subscribeSchoolPage');
    await controller.subscribeSchoolPage(schoolPage.id, req);
    expect(memberService.subscribeSchoolPage).toHaveBeenCalledWith(
      schoolPage.id,
      req.user.sub,
    );
  });

  it('학교페이지 구독 취소', async () => {
    const schoolPage = new SchoolPage();
    schoolPage.id = 1;
    const req = {
      user: {
        sub: 1,
      },
    };

    jest.spyOn(memberService, 'unsubscribeSchoolPage');
    await controller.unsubscribeSchoolPage(schoolPage.id, req);
    expect(memberService.unsubscribeSchoolPage).toHaveBeenCalledWith(
      schoolPage.id,
      req.user.sub,
    );
  });

  it('구독중인 학교페이지 목록', async () => {
    const me = new Member();
    me.id = 1;

    const page = 0;
    const size = 10;
    const req = {
      user: {
        sub: me.id,
      },
    };

    const memberShoolPageSubscribedList: MemberSchoolPageSubscribe[] = [];
    for (let i = 0; i < size; i++) {
      const schoolPage = new SchoolPage();
      schoolPage.id = i;
      schoolPage.schoolName = `학교명 ${i}`;
      schoolPage.region = '서울';
      schoolPage.createdBy = me;
      schoolPage.createdAt = new Date();
      schoolPage.updatedAt = new Date();

      const memberSchoolPageSubscribe = new MemberSchoolPageSubscribe();
      memberSchoolPageSubscribe.id = i;
      memberSchoolPageSubscribe.member = me;
      memberSchoolPageSubscribe.schoolPage = schoolPage;
      memberShoolPageSubscribedList.push(memberSchoolPageSubscribe);
    }

    const total = 20;
    jest
      .spyOn(memberService, 'findSchoolPagesSubscribed')
      .mockResolvedValue([memberShoolPageSubscribedList, total]);

    const result = await controller.getSchoolPagesSubscribed(page, size, req);
    expect(memberService.findSchoolPagesSubscribed).toHaveBeenCalledWith(
      page,
      size,
      me.id,
    );

    expect(result.page.currentPage).toEqual(page);
    expect(result.page.pageSize).toEqual(size);
    expect(result.page.totalCount).toEqual(total);
    expect(result.page.totalPage).toEqual(Math.ceil(total / size));
    expect(result.list.length).toEqual(size);
    expect(result.list[0].id).toBeDefined();
    expect(result.list[0].schoolName).toBeDefined();
    expect(result.list[0].region).toBeDefined();
    expect(result.list[0].createdAt).toBeDefined();
    expect(result.list[0].updatedAt).toBeDefined();
  });

  it('뉴스피드 (타임라인)', async () => {
    const me = new Member();
    me.id = 1;

    const page = 0;
    const size = 10;

    const schoolPage = new SchoolPage();
    schoolPage.id = 1;

    const schoolPageNewsList = [];
    for (let i = 0; i < size; i++) {
      const schoolPageNews = new SchoolPageNews();
      schoolPageNews.id = i + 1;
      schoolPageNews.content = '내용';
      schoolPageNews.schoolPage = schoolPage;
      schoolPageNews.createdAt = new Date();
      schoolPageNews.updatedAt = new Date();
      schoolPageNewsList.push(schoolPageNews);
    }

    const total = 20;
    jest
      .spyOn(memberService, 'findSchoolPageNewsSubscribed')
      .mockResolvedValue([schoolPageNewsList, total]);
    const result = await controller.getSchoolPageNews(page, size, {
      user: { sub: me.id },
    });

    expect(memberService.findSchoolPageNewsSubscribed).toHaveBeenCalledWith(
      me.id,
    );

    expect(result.page.currentPage).toEqual(page);
    expect(result.page.pageSize).toEqual(size);
    expect(result.page.totalCount).toEqual(total);
    expect(result.page.totalPage).toEqual(Math.ceil(total / size));
    expect(result.list.length).toEqual(10);
    expect(result.list[0].id).toEqual(1);
    expect(result.list[0].content).toEqual('내용');
    expect(result.list[0].schoolPage.id).toEqual(schoolPage.id);
    expect(result.list[0].createdAt).toBeDefined();
    expect(result.list[0].updatedAt).toBeDefined();
  });
});
