import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CommonStatus } from '../../../core/db/database.common.entity';
import { Member } from '../../../core/db/domain/member/member.entity';
import { SchoolPageNews } from '../../../core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPage } from '../../../core/db/domain/school-page/school-page.entity';
import { ErrorMessage } from '../../config/constants';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from './dto/school-page-news.request';

@Injectable()
export class SchoolPageNewsService {
  constructor(
    @InjectRepository(SchoolPageNews)
    private readonly schoolPageNewsRepository: Repository<SchoolPageNews>,
    @InjectRepository(SchoolPage)
    private readonly schoolPageRepository: Repository<SchoolPage>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async save(
    request: SchoolPageNewsRequest,
    createdBy: number,
  ): Promise<SchoolPageNews> {
    const schoolPageId = request.schoolPageId;
    const schoolPage = await this.findSchoolPageOneOnlyActiveById(schoolPageId);

    if (schoolPage === null) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_SCHOOL_PAGE_MESSAGE);
    }

    if (!schoolPage.doesMemberCreatedById(createdBy)) {
      throw new ForbiddenException(
        '해당 학교페이지에 소식을 작성 할수 있는 권한이 없습니다.',
      );
    }

    const member = await this.memberRepository.findOne({
      where: {
        id: createdBy,
      },
    });
    const { content } = request;
    const newSchoolPageNews = SchoolPageNews.of(content, schoolPage, member);

    await this.schoolPageNewsRepository.save(newSchoolPageNews);
    return newSchoolPageNews;
  }

  async update(
    schoolPageNewsId: number,
    request: SchoolPageNewsUpdateRequest,
    memberId: number,
  ): Promise<SchoolPageNews> {
    const { content } = request;

    const schoolPageNews = await this.schoolPageNewsRepository.findOne({
      where: {
        id: schoolPageNewsId,
      },
      relations: {
        createdBy: true,
        schoolPage: true,
      },
    });

    if (schoolPageNews === null) {
      throw new NotFoundException(
        ErrorMessage.NOT_FOUND_SCHOOL_PAGE_NEWS_MESSAGE,
      );
    }

    if (schoolPageNews.schoolPage.status === CommonStatus.DELETED) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_SCHOOL_PAGE_MESSAGE);
    }

    if (schoolPageNews.createdBy.id !== memberId) {
      throw new ForbiddenException(
        '해당 학교페이지의 소식을 수정 할수 있는 권한이 없습니다.',
      );
    }

    schoolPageNews.update(content);

    await this.schoolPageNewsRepository.save(schoolPageNews);
    return schoolPageNews;
  }

  findSchoolPageNewsPage(
    page: number,
    size: number,
    schoolPageId: number,
  ): Promise<[SchoolPageNews[], number]> {
    return this.schoolPageNewsRepository
      .createQueryBuilder('news')
      .innerJoin('news.schoolPage', 'schoolPage')
      .select(['news', 'schoolPage.id'])
      .where('schoolPage.id = :schoolPageId', { schoolPageId })
      .offset(page * size)
      .limit(size)
      .orderBy('news.createdAt', 'DESC')
      .getManyAndCount();
  }

  async delete(schoolPageNewsId: number, memberId: number): Promise<any> {
    const schoolPageNews = await this.schoolPageNewsRepository.findOne({
      where: {
        id: schoolPageNewsId,
      },
      relations: {
        createdBy: true,
        schoolPage: true,
      },
    });

    if (schoolPageNews === null) {
      throw new NotFoundException(
        ErrorMessage.NOT_FOUND_SCHOOL_PAGE_NEWS_MESSAGE,
      );
    }

    if (schoolPageNews.schoolPage.status === CommonStatus.DELETED) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND_SCHOOL_PAGE_MESSAGE);
    }

    if (schoolPageNews.createdBy.id !== memberId) {
      throw new ForbiddenException(
        '해당 학교페이지의 소식을 삭제할 수 있는 권한이 없습니다.',
      );
    }

    await this.schoolPageNewsRepository.delete({
      id: schoolPageNewsId,
    });
  }

  async findSchoolPageOneOnlyActiveById(id: number) {
    return this.schoolPageRepository.findOne({
      where: {
        id,
        status: CommonStatus.ACTIVE,
      },
      relations: {
        createdBy: true,
      },
    });
  }
}
