import { ApiProperty } from '@nestjs/swagger';
import { EncryptUtils } from '../../../../common/util/encrypt.util';
import {
  Member,
  MemberRole,
} from '../../../../core/db/domain/member/member.entity';
import { API_EXAMPLE } from '../../../config/constants';

export class MemberResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: API_EXAMPLE.STUDENT_EMAIL })
  email: string;

  @ApiProperty({ example: API_EXAMPLE.STUDENT_NAME })
  name: string;

  @ApiProperty({ example: MemberRole.STUDENT })
  role: MemberRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static async create(member: Member) {
    const response = new MemberResponse();
    response.id = member.id;
    response.email = await EncryptUtils.decrypt(member.email);
    response.name = member.name;
    response.role = member.role;
    response.createdAt = member.createdAt;
    response.updatedAt = member.updatedAt;
    return response;
  }
}
