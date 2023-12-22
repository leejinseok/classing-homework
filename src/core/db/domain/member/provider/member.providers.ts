import { DataSource } from 'typeorm';
import { Member } from '../entity/member.entity';
import { DATA_SOURCE } from 'src/api/config/constants';
export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';

export const memberRepository = {
  provide: MEMBER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Member),
  inject: [DATA_SOURCE],
};
