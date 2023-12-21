import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Inject, Injectable } from '@nestjs/common';
import { MEMBER_REPOSITORY } from '../provider/member.providers';

@Injectable()
export class MemberService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private memberRepository: Repository<Member>,
  ) { }


}
