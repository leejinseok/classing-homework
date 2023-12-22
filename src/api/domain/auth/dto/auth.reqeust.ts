import { MemberRole } from 'src/core/domain/member/entity/member.entity';

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
