import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from 'src/core/domain/member/provider/member.providers';
import { Member } from 'src/core/domain/member/entity/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private memberRepository: Repository<Member>,
  ) {}
}
