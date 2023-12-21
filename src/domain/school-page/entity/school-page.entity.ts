import { Common } from 'src/config/database/database.common.entity';
import { Member } from 'src/domain/member/entity/member.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
