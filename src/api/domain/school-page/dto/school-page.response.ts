import { SchoolPage } from 'src/core/db/domain/school-page/school-page.entity';

export class SchoolPageResponse {
  id: bigint;
  schoolName: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;

  static create(schoolPage: SchoolPage) {
    const response = new SchoolPageResponse();
    response.id = schoolPage.id;
    response.schoolName = schoolPage.schoolName;
    response.region = schoolPage.region;
    response.createdAt = schoolPage.createdAt;
    response.updatedAt = schoolPage.updatedAt;
    return response;
  }
}
