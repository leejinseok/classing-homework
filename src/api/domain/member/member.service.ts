import { Brackets, Repository } from 'typeorm';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MEMBER_REPOSITORY,
  MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY,
} from 'src/core/db/domain/member/member.providers';
import { Member } from 'src/core/db/domain/member/member.entity';
import { MemberSchoolPageSubscribe } from 'src/core/db/domain/member/member-schoolPage-subscribe.entity';
import { SCHOOL_PAGE_REPOSITORY } from 'src/core/db/domain/school-page/school-page.providers';
import { SchoolPage } from 'src/core/db/domain/school-page/school-page.entity';
import { ErrorMessage } from 'src/api/config/constants';
import { CommonStatus } from 'src/core/db/database.common.entity';
import { SCHOOL_PAGE_NEWS_REPOSITORY } from 'src/core/db/domain/school-page-news/school-page-news.providers';
import { SchoolPageNews } from 'src/core/db/domain/school-page-news/school-page-news.entity';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private memberRepository: Repository<Member>,
    @Inject(MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY)
    private memberSchoolPageSubscribeRepository: Repository<MemberSchoolPageSubscribe>,
    @Inject(SCHOOL_PAGE_REPOSITORY)
    private schoolPageRepository: Repository<SchoolPage>,
    @Inject(SCHOOL_PAGE_NEWS_REPOSITORY)
    private schoolPageNewsRepository: Repository<SchoolPageNews>,
  ) {}

  async subscribeSchoolPage(schoolPageId: number, memberId: number) {
    const schoolPage = await this.schoolPageRepository.findOne({
      where: {
        id: schoolPageId,
      },
    });

    if (schoolPage === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_SCHOOL_PAGE_MESSAGE);
    }

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (member === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_MEMBER_MESSAGE);
    }

    const duplicated = await this.memberSchoolPageSubscribeRepository
      .createQueryBuilder('subscribe')
      .select('subscribe.id')
      .leftJoin('subscribe.schoolPage', 'schoolPage')
      .leftJoin('subscribe.member', 'member')
      .where('subscribe.schoolPage.id = :schoolPageId', { schoolPageId })
      .andWhere('subscribe.member.id = :memberId', { memberId })
      .andWhere('subscribe.status = :status', { status: CommonStatus.ACTIVE })
      .getCount();

    if (duplicated) {
      throw new ConflictException('이미 구독한 학교페이지입니다.');
    }

    const memberSchoolPageSubscribe = MemberSchoolPageSubscribe.of(
      member,
      schoolPage,
    );

    await this.memberSchoolPageSubscribeRepository.save(
      memberSchoolPageSubscribe,
    );
  }

  async unsubscribeSchoolPage(schoolPageId: number, memberId: number) {
    const subscribe = await this.memberSchoolPageSubscribeRepository
      .createQueryBuilder('subscribe')
      .leftJoinAndSelect('subscribe.schoolPage', 'schoolPage')
      .leftJoinAndSelect('subscribe.member', 'member')
      .where('subscribe.schoolPage.id = :schoolPageId', { schoolPageId })
      .andWhere('subscribe.member.id = :memberId', { memberId })
      .getOne();

    subscribe.unsubscribe();

    await this.memberSchoolPageSubscribeRepository.update(
      {
        id: subscribe.id,
      },
      {
        unsubscribedAt: subscribe.unsubscribedAt,
        status: subscribe.status,
      },
    );
  }

  async findSchoolPagesSubscribed(
    page: number,
    size: number,
    memberId: number,
  ) {
    return this.memberSchoolPageSubscribeRepository
      .createQueryBuilder('subscribe')
      .innerJoinAndSelect('subscribe.schoolPage', 'schoolPage')
      .innerJoin('subscribe.member', 'member')
      .where('member.id = :memberId', { memberId })
      .offset(page * size)
      .limit(size)
      .getManyAndCount();
  }

  async findSchoolPageNews(memberId: number) {
    return this.schoolPageNewsRepository
      .createQueryBuilder('news')
      .innerJoinAndSelect('news.schoolPage', 'schoolPage')
      .innerJoin('schoolPage.subscribers', 'subscriber')
      .where('subscriber.member_id = :memberId', { memberId })
      .andWhere('news.created_at >= subscriber.created_at')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'subscriber.unsubscribed_at is not null and subscriber.unsubscribed_at >= news.created_at',
          ).orWhere('subscriber.unsubscribed_at is null');
        }),
      )
      .orderBy('news.created_at', 'DESC')
      .getManyAndCount();
  }
}
