import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../../../../api/config/constants';
import { SchoolPage } from './school-page.entity';
export const SCHOOL_PAGE_REPOSITORY = 'SCHOOL_PAGE_REPOSITORY';

export const schoolPageRepository = {
  provide: SCHOOL_PAGE_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(SchoolPage),
  inject: [DATA_SOURCE],
};
