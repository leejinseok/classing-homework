import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { API_EXAMPLE } from 'src/api/config/constants';
import { MemberRole } from 'src/core/db/domain/member/member.entity';

export class SignUpRequest {
  @IsEmail()
  @ApiProperty({ example: API_EXAMPLE.STUDENT_EMAIL })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: API_EXAMPLE.STUDENT_NAME })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: API_EXAMPLE.PASSWORD })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ enum: MemberRole, example: MemberRole.STUDENT })
  role: MemberRole;
}

export class LoginRequest {
  @IsEmail()
  @ApiProperty({ example: API_EXAMPLE.STUDENT_EMAIL })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: API_EXAMPLE.PASSWORD })
  password: string;
}
