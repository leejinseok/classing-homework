import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/api/config/constants';
import { SchoolPageNews } from './school-page-news.entity';
export const SCHOOL_PAGE_NEWS_REPOSITORY = 'SCHOOL_PAGE_NEWS_REPOSITORY';

export const schoolPageNewsRepository = {
  provide: SCHOOL_PAGE_NEWS_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(SchoolPageNews),
  inject: [DATA_SOURCE],
};
