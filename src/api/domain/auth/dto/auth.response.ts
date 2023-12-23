import { ApiProperty } from '@nestjs/swagger';
import { API_EXAMPLE } from 'src/api/config/constants';
import { Member, MemberRole } from 'src/core/db/domain/member/member.entity';

export class SignUpResposne {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.ADMIN_NAME })
  name: string;

  @ApiProperty({ example: MemberRole.ADMIN })
  role: MemberRole;

  static create(member: Member): SignUpResposne {
    const response = new SignUpResposne();
    response.id = member.id;
    response.name = member.name;
    response.role = member.role;
    return response;
  }
}

export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  static of(accessToken: string, refreshToken: string) {
    const response = new TokenResponse();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    return response;
  }
}
