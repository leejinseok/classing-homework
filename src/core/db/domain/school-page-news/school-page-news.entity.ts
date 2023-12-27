import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Common, CommonStatus } from '../../database.common.entity';
import { SchoolPage } from '../school-page/school-page.entity';
import { Member } from '../member/member.entity';

@Entity()
export class SchoolPageNews extends Common {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => SchoolPage)
  @JoinColumn({
    name: 'school_page_id',
    foreignKeyConstraintName: 'fk_school_page_news_1',
  })
  schoolPage: SchoolPage;

  @ManyToOne(() => Member)
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_school_page_news_2',
  })
  createdBy: Member;

  @Column({ type: 'varchar', default: CommonStatus.ACTIVE })
  status: CommonStatus;

  static of(content: string, schoolPage: SchoolPage, createdBy: Member) {
    const schoolPageNews = new SchoolPageNews();
    schoolPageNews.content = content;
    schoolPageNews.schoolPage = schoolPage;
    schoolPageNews.createdBy = createdBy;
    return schoolPageNews;
  }

  update(content: string) {
    this.content = content;
  }
}
