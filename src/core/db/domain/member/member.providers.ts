import { DataSource } from 'typeorm';
import { Member } from './member.entity';
import { DATA_SOURCE } from 'src/api/config/constants';
import { MemberSchoolPageSubscribe } from './member-schoolPage-subscribe.entity';

export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';
export const MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY =
  'MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY';

export const memberRepository = {
  provide: MEMBER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Member),
  inject: [DATA_SOURCE],
};

export const memberSchoolPageSubscribeRepository = {
  provide: MEMBER_SCHOOL_PAGE_SUBSCRIBE_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(MemberSchoolPageSubscribe),
  inject: [DATA_SOURCE],
};
