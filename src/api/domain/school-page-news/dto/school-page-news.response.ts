import { SchoolPageNews } from 'src/core/db/domain/school-page-news/school-page-news.entity';
import { SchoolPageResponse } from '../../school-page/dto/school-page.response';

export class SchoolPageNewsResponse {
  id: number;
  content: string;
  schoolPageId: number;
  createdAt: Date;
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
  id: number;
  content: string;
  schoolPage: SchoolPageResponse;
  createdAt: Date;
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
