import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MEMBER_REPOSITORY,
  MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY,
} from 'src/core/db/domain/member/member.providers';
import { Member } from 'src/core/db/domain/member/member.entity';
import { MemberSchoolPageSubscribe } from 'src/core/db/domain/member/member-schoolPage-subscribe.entity';
import { SCHOOL_PAGE_REPOSITORY } from 'src/core/db/domain/school-page/school-page.providers';
import { SchoolPage } from 'src/core/db/domain/school-page/school-page.entity';
import { ErrorMessage } from 'src/api/config/constants';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private memberRepository: Repository<Member>,
    @Inject(MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY)
    private memberSchoolPageSubscribeRepository: Repository<MemberSchoolPageSubscribe>,
    @Inject(SCHOOL_PAGE_REPOSITORY)
    private schoolPageRepository: Repository<SchoolPage>,
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

    const memberSchoolPageSubscribe = MemberSchoolPageSubscribe.of(
      member,
      schoolPage,
    );

    await this.memberSchoolPageSubscribeRepository.save(
      memberSchoolPageSubscribe,
    );
  }
}
