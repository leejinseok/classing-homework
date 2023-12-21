import { Inject, Injectable } from '@nestjs/common';
import { Member } from 'src/domain/member/entity/member.entity';
import { MEMBER_REPOSITORY } from 'src/domain/member/provider/member.providers';
import { Repository } from 'typeorm';
import { SignUpRequest } from '../controller/dto/auth.reqeust';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: Repository<Member>,
  ) {}

  signUp(request: SignUpRequest): Promise<Member> {
    const member = this.memberRepository.save(Member.create(request));
    return member;
  }
}
