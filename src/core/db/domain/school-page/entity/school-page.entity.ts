import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Member } from '../../member/entity/member.entity';
import { Common } from 'src/core/db/database.common.entity';

@Entity()
@Unique('uidx_school_page_1', ['schoolName', 'region'])
export class SchoolPage extends Common {
  @PrimaryGeneratedColumn()
  id: bigint;

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

  static create(schoolName: string, region: string, createdBy: Member) {
    const schoolPage = new SchoolPage();
    schoolPage.schoolName = schoolName;
    schoolPage.region = region;
    schoolPage.createdBy = createdBy;
    return schoolPage;
  }
}
