import { Common } from 'src/core/common/database.common.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../../member/entity/member.entity';

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
