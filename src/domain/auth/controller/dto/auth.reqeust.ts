import { MemberRole } from 'src/domain/member/entity/member.entity';

export class SignUpRequest {
  name: string;
  role: MemberRole;
}

export class LoginRequest {}
