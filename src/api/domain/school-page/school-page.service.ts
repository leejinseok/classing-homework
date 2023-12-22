import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Member } from 'src/core/db/domain/member/entity/member.entity';
import { MEMBER_REPOSITORY } from 'src/core/db/domain/member/provider/member.providers';
import { SchoolPage } from 'src/core/db/domain/school-page/entity/school-page.entity';
import { SCHOOL_PAGE_REPOSITORY } from 'src/core/db/domain/school-page/provider/school-page.providers';
import { Repository } from 'typeorm';
import { SchoolPageRequest } from './dto/school-page.request';
import { ErrorMessage } from 'src/api/config/constants';

@Injectable()
export class SchoolPageService {
  constructor(
    @Inject(SCHOOL_PAGE_REPOSITORY)
    private readonly schoolPageRepository: Repository<SchoolPage>,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async save(
    request: SchoolPageRequest,
    memberId: bigint,
  ): Promise<SchoolPage> {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (member === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_MEMBER_MESSAGE);
    }

    const schoolPage = SchoolPage.create(
      request.schoolName,
      request.region,
      member,
    );

    await this.schoolPageRepository.save(schoolPage);
    return schoolPage;
  }
}
