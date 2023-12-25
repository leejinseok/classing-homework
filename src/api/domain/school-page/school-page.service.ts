import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CommonStatus } from '../../../core/db/database.common.entity';
import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { ErrorMessage } from '../../config/constants';
import { SchoolPageRequest } from './dto/school-page.request';

@Injectable()
export class SchoolPageService {
  constructor(
    @InjectRepository(SchoolPage)
    private readonly schoolPageRepository: Repository<SchoolPage>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  private async findMemberById(memberId: number): Promise<Member> {
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

  async save(
    request: SchoolPageRequest,
    memberId: number,
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
    schoolPageId: number,
    memberId: number,
  ): Promise<any> {
    const schoolPage = await this.findOnlyActiveById(schoolPageId);
    const doesMemberCreated = schoolPage.doesMemberCreatedById(memberId);

    if (!doesMemberCreated) {
      throw new ForbiddenException(
        '학교페이지 수정은 해당 페이지를 개설한 사용자만 가능합니다',
      );
    }

    schoolPage.update(request.schoolName, request.region);
    return schoolPage;
  }

  async findOnlyActiveById(schoolPageId: number): Promise<SchoolPage> {
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

  async delete(schoolPageId: number, memberId: number) {
    const schoolPage = await this.findOnlyActiveById(schoolPageId);

    const doseMemberCreated = schoolPage.doesMemberCreatedById(memberId);
    if (!doseMemberCreated) {
      throw new ForbiddenException(
        '학교페이지 삭제는 해당 페이지를 개설한 사용자만 가능합니다',
      );
    }

    schoolPage.delete();
    this.schoolPageRepository.update({ id: schoolPageId }, { ...schoolPage });
  }
}
