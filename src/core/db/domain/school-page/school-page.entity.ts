import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Common, CommonStatus } from '../../database.common.entity';
import { MemberSchoolPageSubscribe } from '../member/member-schoolPage-subscribe.entity';
import { Member } from '../member/member.entity';
import { SchoolPageNews } from '../school-page-news/school-page-news.entity';

@Entity()
@Unique('uidx_school_page_1', ['schoolName', 'region'])
export class SchoolPage extends Common {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  schoolName: string;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @ManyToOne(() => Member, (member) => member.schoolPages, { nullable: false })
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_school_page_1',
  })
  createdBy: Member;

  @Column({ type: 'varchar', length: 30, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @OneToMany(
    () => SchoolPageNews,
    (schoolPageNews) => schoolPageNews.schoolPage,
    {
      lazy: true,
    },
  )
  news: SchoolPageNews[];

  @OneToMany(
    () => MemberSchoolPageSubscribe,
    (subscribe) => subscribe.schoolPage,
    {
      lazy: true,
    },
  )
  subscribers: Member[];

  static create(schoolName: string, region: string, createdBy: Member) {
    const schoolPage = new SchoolPage();
    schoolPage.schoolName = schoolName;
    schoolPage.region = region;
    schoolPage.createdBy = createdBy;
    return schoolPage;
  }

  update(schoolName: string, region: string) {
    this.schoolName = schoolName;
    this.region = region;
  }

  delete() {
    this.status = CommonStatus.DELETED;
  }

  doesMemberCreated(member: Member): boolean {
    return member.id === this.createdBy.id;
  }

  doesMemberCreatedById(memberId: number) {
    return memberId === this.createdBy.id;
  }
}
