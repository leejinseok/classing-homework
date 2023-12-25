import { DataSource } from 'typeorm';
import { SchoolPageNews } from './school-page-news.entity';
import { DATA_SOURCE } from '../../../../api/config/constants';
export const SCHOOL_PAGE_NEWS_REPOSITORY = 'SCHOOL_PAGE_NEWS_REPOSITORY';

export const schoolPageNewsRepository = {
  provide: SCHOOL_PAGE_NEWS_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(SchoolPageNews),
  inject: [DATA_SOURCE],
};
