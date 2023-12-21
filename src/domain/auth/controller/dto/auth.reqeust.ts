import { MemberRole } from 'src/domain/member/entity/member.entity';

export class SignUpRequest {
  email: string;
  name: string;
  password: string;
  role: MemberRole;
}

export class LoginRequest {}
