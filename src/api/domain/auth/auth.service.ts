import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptUtils } from 'src/common/util/bcrypt.util';
import { EncryptUtils } from 'src/common/util/encrypt.util';
import { Member } from 'src/core/db/domain/member/member.entity';
import { Repository } from 'typeorm';
import { LoginRequest, SignUpRequest } from './dto/auth.reqeust';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(request: SignUpRequest): Promise<Member> {
    const { hash, salt } = await BcryptUtils.hash(request.password);
    request.password = hash;
    request.email = await EncryptUtils.encrypt(request.email);

    const member = Member.create(request);
    await this.memberRepository.save(member);
    return member;
  }

  async login(request: LoginRequest): Promise<Member> {
    const encrypt = await EncryptUtils.encrypt(request.email);
    const member = await this.memberRepository.findOne({
      where: {
        email: encrypt,
      },
    });

    if (member == null) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }

    const isMatched = await BcryptUtils.compare(
      request.password,
      member.password,
    );

    if (!isMatched) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }

    return member;
  }
}
