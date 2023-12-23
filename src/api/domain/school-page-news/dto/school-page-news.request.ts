import { ApiProperty } from '@nestjs/swagger';
import { API_EXAMPLE } from 'src/api/config/constants';

export class SchoolPageNewsRequest {
  @ApiProperty({ example: 1 })
  schoolPageId: number;

  @ApiProperty({ example: API_EXAMPLE.SCHOOL_PAGE_NEWS_CONTENT })
  content: string;
}

export class SchoolPageNewsUpdateRequest {
  @ApiProperty({ example: API_EXAMPLE.SCHOOL_PAGE_NEWS_CONTENT })
  content: string;
}
