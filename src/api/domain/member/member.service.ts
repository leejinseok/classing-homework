import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from 'src/core/db/domain/member/member.providers';
import { Member } from 'src/core/db/domain/member/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private memberRepository: Repository<Member>,
  ) {}

  subscribeSchoolPage(schoolPageId: number, memberId: bigint) {}
}
