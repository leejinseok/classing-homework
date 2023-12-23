import { ApiProperty } from '@nestjs/swagger';
import { API_EXAMPLE } from 'src/api/config/constants';
import { SchoolPage } from 'src/core/db/domain/school-page/school-page.entity';

export class SchoolPageResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.SCHOOL_NAME })
  schoolName: string;

  @ApiProperty({ example: '서울' })
  region: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
