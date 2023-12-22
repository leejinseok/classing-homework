import { SchoolPageNews } from 'src/core/db/domain/school-page-news/school-page-news.entity';

export class SchoolPageNewsResponse {
  id: bigint;
  content: string;
  schoolPageId: bigint;
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
