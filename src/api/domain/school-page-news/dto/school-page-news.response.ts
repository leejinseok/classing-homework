import { ApiProperty } from '@nestjs/swagger';
import { SchoolPageNews } from '../../../../core/db/domain/school-page-news/school-page-news.entity';
import { API_EXAMPLE } from '../../../config/constants';
import { SchoolPageResponse } from '../../school-page/dto/school-page.response';

export class SchoolPageNewsResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.SCHOOL_PAGE_NEWS_CONTENT })
  content: string;

  @ApiProperty({ example: 1 })
  schoolPageId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static create(schoolPageNews: SchoolPageNews) {
    const response = new SchoolPageNewsResponse();
    response.id = schoolPageNews.id;
    response.content = schoolPageNews.content;
    response.schoolPageId = schoolPageNews.schoolPage.id;
    response.createdAt = schoolPageNews.createdAt;
    response.updatedAt = schoolPageNews.updatedAt;
    return response;
  }
}

export class SchoolPageNewsWithSchoolPageResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.SCHOOL_PAGE_NEWS_CONTENT })
  content: string;

  @ApiProperty()
  schoolPage: SchoolPageResponse;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static create(schoolPageNews: SchoolPageNews) {
    const response = new SchoolPageNewsWithSchoolPageResponse();
    response.id = schoolPageNews.id;
    response.content = schoolPageNews.content;
    response.schoolPage = SchoolPageResponse.create(schoolPageNews.schoolPage);
    response.createdAt = schoolPageNews.createdAt;
    response.updatedAt = schoolPageNews.updatedAt;
    return response;
  }
}
