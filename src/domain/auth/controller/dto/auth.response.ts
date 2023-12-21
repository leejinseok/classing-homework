import { Member, MemberRole } from 'src/domain/member/entity/member.entity';

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
