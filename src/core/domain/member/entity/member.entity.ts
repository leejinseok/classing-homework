import { Common } from 'src/core/common/database.common.entity';
import { SignUpRequest } from 'src/api/domain/auth/dto/auth.reqeust';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolPage } from '../../school-page/entity/school-page.entity';

export enum MemberRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

@Entity()
export class Member extends Common {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  role!: MemberRole;

  @OneToMany(() => SchoolPage, (schoolPage) => schoolPage.createdBy, {
    lazy: true,
  })
  schoolPages: SchoolPage[];

  static create(request: SignUpRequest): Member {
    const member = new Member();
    member.email = request.email;
    member.name = request.name;
    member.password = request.password;
    member.role = request.role;
    return member;
  }
}
