import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../constants';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'classting-homework',
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
