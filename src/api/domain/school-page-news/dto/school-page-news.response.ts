import { SchoolPageNews } from 'src/core/db/domain/school-page-news/school-page-news.entity';

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
