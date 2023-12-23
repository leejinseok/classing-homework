import { ApiProperty } from '@nestjs/swagger';
import { API_EXAMPLE } from 'src/api/config/constants';
import { MemberRole } from 'src/core/db/domain/member/member.entity';

export class SignUpRequest {
  @ApiProperty({ example: API_EXAMPLE.STUDENT_EMAIL })
  email: string;

  @ApiProperty({ example: API_EXAMPLE.STUDENT_NAME })
  name: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ enum: MemberRole, example: MemberRole.STUDENT })
  role: MemberRole;
}

export class LoginRequest {
  @ApiProperty({ example: API_EXAMPLE.STUDENT_EMAIL })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;
}
