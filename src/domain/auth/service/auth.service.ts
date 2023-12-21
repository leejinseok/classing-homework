import { Inject, Injectable } from '@nestjs/common';
import { Member } from 'src/domain/member/entity/member.entity';
import { MEMBER_REPOSITORY } from 'src/domain/member/provider/member.providers';
import { Repository } from 'typeorm';
import { SignUpRequest } from '../controller/dto/auth.reqeust';
import { BcryptUtils } from 'src/util/bcrypt.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(request: SignUpRequest): Promise<Member> {
    const { hash, salt } = await BcryptUtils.hash(request.password);
    request.password = hash;

    const member = Member.create(request);
    await this.memberRepository.save(member);
    return member;
  }
}
