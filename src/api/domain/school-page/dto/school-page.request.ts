import { ApiProperty } from '@nestjs/swagger';
import { API_EXAMPLE } from 'src/api/config/constants';

export class SchoolPageRequest {
  @ApiProperty({ example: API_EXAMPLE.SCHOOL_NAME })
  schoolName: string;

  @ApiProperty({ example: '서울' })
  region: string;
}
