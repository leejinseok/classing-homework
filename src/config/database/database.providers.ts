import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../constants';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        logging: true,
        synchronize: true,
        dropSchema: true,
        namingStrategy: new SnakeNamingStrategy(),
      });

      return dataSource.initialize();
    },
  },
];
