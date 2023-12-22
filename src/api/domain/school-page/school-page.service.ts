import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member } from 'src/core/db/domain/member/member.entity';
import { MEMBER_REPOSITORY } from 'src/core/db/domain/member/member.providers';
import { SchoolPage } from 'src/core/db/domain/school-page/school-page.entity';
import { SCHOOL_PAGE_REPOSITORY } from 'src/core/db/domain/school-page/school-page.providers';
import { Repository } from 'typeorm';
import { SchoolPageRequest } from './dto/school-page.request';
import { ErrorMessage } from 'src/api/config/constants';
import { CommonStatus } from 'src/core/db/database.common.entity';

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
    const member = await this.findMemberById(memberId);

    const schoolPage = SchoolPage.create(
      request.schoolName,
      request.region,
      member,
    );

    await this.schoolPageRepository.save(schoolPage);
    return schoolPage;
  }

  async update(
    request: SchoolPageRequest,
    schoolPageId: bigint,
    memberId: bigint,
  ): Promise<any> {
    const member = await this.findMemberById(memberId);
    const schoolPage = await this.findOnlyActiveById(schoolPageId);
    const doesMemberCreated = schoolPage.doesMemberCreated(member);

    if (!doesMemberCreated) {
      throw new ForbiddenException(
        '학교페이지 수정은 해당 페이지를 개설한 사용자만 가능합니다',
      );
    }

    schoolPage.update(request.schoolName, request.region);
    return schoolPage;
  }

  async findOnlyActiveById(schoolPageId: bigint): Promise<SchoolPage> {
    const schoolPage = await this.schoolPageRepository.findOne({
      where: {
        id: schoolPageId,
        status: CommonStatus.ACTIVE,
      },
      relations: {
        createdBy: true,
      },
    });

    if (schoolPage === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_SCHOOL_PAGE_MESSAGE);
    }

    return schoolPage;
  }

  async delete(schoolPageId: bigint, memberId: bigint) {
    const member = await this.findMemberById(memberId);
    const schoolPage = await this.findOnlyActiveById(schoolPageId);

    const doseMemberCreated = schoolPage.doesMemberCreated(member);
    if (!doseMemberCreated) {
      throw new ForbiddenException(
        '학교페이지 삭제는 해당 페이지를 개설한 사용자만 가능합니다',
      );
    }

    schoolPage.delete();
    this.schoolPageRepository.update(
      {
        id: schoolPageId,
      },
      {
        ...schoolPage,
      },
    );
  }

  private async findMemberById(memberId: bigint): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (member === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_MEMBER_MESSAGE);
    }

    return member;
  }
}
