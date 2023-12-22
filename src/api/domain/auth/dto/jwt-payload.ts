import { MemberRole } from 'src/core/db/domain/member/member.entity';

export interface JwtPayload {
  exp: number;
  iat: number;
  name: string;
  role: MemberRole;
  sub: number;
}
