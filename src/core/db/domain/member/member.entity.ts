import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { API_EXAMPLE } from '../../../../api/config/constants';
import { SignUpRequest } from '../../../../api/domain/auth/dto/auth.reqeust';
import { BcryptUtils } from '../../../../common/util/bcrypt.util';
import { EncryptUtils } from '../../../../common/util/encrypt.util';
import { Common } from '../../database.common.entity';
import { SchoolPage } from '../school-page/school-page.entity';
import { MemberSchoolPageSubscribe } from './member-schoolPage-subscribe.entity';

export enum MemberRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

@Entity()
export class Member extends Common {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

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

  @OneToMany(
    () => MemberSchoolPageSubscribe,
    (memberSchoolPageSubscribe) => memberSchoolPageSubscribe.member,
    {
      lazy: true,
    },
  )
  schoolPagesSubscribed: SchoolPage[];

  static create(request: SignUpRequest): Member {
    const member = new Member();
    member.email = request.email;
    member.name = request.name;
    member.password = request.password;
    member.role = request.role;
    return member;
  }

  static async createStudentSample() {
    const member = new Member();
    member.id = 1;
    member.name = API_EXAMPLE.STUDENT_NAME;
    member.email = await EncryptUtils.encrypt(API_EXAMPLE.STUDENT_EMAIL);
    const { hash } = await BcryptUtils.hash(API_EXAMPLE.PASSWORD);
    member.password = hash;
    member.role = MemberRole.STUDENT;
    member.createdAt = new Date();
    member.updatedAt = new Date();
    return member;
  }

  static async createAdminSample() {
    const member = new Member();
    member.id = 1;
    member.name = API_EXAMPLE.ADMIN_NAME;
    member.email = await EncryptUtils.encrypt(API_EXAMPLE.ADMIN_EMAIL);
    const { hash } = await BcryptUtils.hash(API_EXAMPLE.PASSWORD);
    member.password = hash;
    member.role = MemberRole.STUDENT;
    member.createdAt = new Date();
    member.updatedAt = new Date();
    return member;
  }
}
