import {
  Member,
  MemberRole,
} from 'src/core/domain/member/entity/member.entity';

export class SignUpResposne {
  id: bigint;
  name: string;
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
  accessToken: string;
  refreshToken: string;

  static of(accessToken: string, refreshToken: string) {
    const response = new TokenResponse();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    return response;
  }
}
