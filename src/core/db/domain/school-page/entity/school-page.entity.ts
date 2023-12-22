import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../../member/entity/member.entity';
import { Common } from 'src/core/db/database.common.entity';

@Entity()
export class SchoolPage extends Common {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => Member, (member) => member.schoolPages, { nullable: false })
  @JoinColumn({
    name: 'created_by',
    foreignKeyConstraintName: 'fk_schoolpage_1',
  })
  createdBy: Member;
}
