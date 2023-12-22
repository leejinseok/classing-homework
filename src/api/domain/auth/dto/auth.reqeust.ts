import { MemberRole } from 'src/core/db/domain/member/member.entity';

export class SignUpRequest {
  email: string;
  name: string;
  password: string;
  role: MemberRole;
}

export class LoginRequest {
  email: string;
  password: string;
}
