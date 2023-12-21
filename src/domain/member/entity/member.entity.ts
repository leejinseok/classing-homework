import { Common } from 'src/config/database/database.common.entity';
import { SignUpRequest } from 'src/domain/auth/controller/dto/auth.reqeust';
import { SchoolPage } from 'src/domain/school-page/entity/school-page.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  static create(dto: SignUpRequest): Member {
    const member = new Member();
    member.name = dto.name;
    member.role = dto.role;
    return member;
  }
}
