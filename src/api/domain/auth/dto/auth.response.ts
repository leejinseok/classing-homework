import { ApiProperty } from '@nestjs/swagger';
import { EncryptUtils } from '../../../../common/util/encrypt.util';
import {
  Member,
  MemberRole,
} from '../../../../core/db/domain/member/member.entity';
import { API_EXAMPLE } from '../../../config/constants';

export class SignUpResposne {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.ADMIN_EMAIL })
  email: string;

  @ApiProperty({ example: API_EXAMPLE.ADMIN_NAME })
  name: string;

  @ApiProperty({ example: MemberRole.ADMIN })
  role: MemberRole;

  @ApiProperty()
  createdAt: Date;

  static async create(member: Member): Promise<SignUpResposne> {
    const response = new SignUpResposne();
    response.id = member.id;
    response.email = await EncryptUtils.decrypt(member.email);
    response.name = member.name;
    response.role = member.role;
    response.createdAt = member.createdAt;
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
