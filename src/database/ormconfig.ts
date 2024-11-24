import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import 'dotenv/config';
import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';
import { Environment } from '../constants';

const connectionOptions: TypeOrmModuleOptions &
  SeederOptions &
  DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_POSTGRES_HOST,
  port: parseInt(process.env.DATABASE_POSTGRES_PORT || '5432', 10),
  username: process.env.DATABASE_POSTGRES_USERNAME,
  password: process.env.DATABASE_POSTGRES_PASSWORD,
  database: process.env.DATABASE_POSTGRES_NAME,
  connectTimeoutMS: 0,
  logNotifications: true,
  synchronize:
    [String(Environment.local), String(Environment.test)].indexOf(
      process.env.ENV,
    ) !== -1,
  entities: [join(__dirname, '..', 'modules/**/*.entity.{ts,js}')],
  poolErrorHandler: (err) => {
    console.log(err);
  },
  migrationsTableName: 'migrations',
  migrations: [join(__dirname, '..', 'database/migrations/*{.js,.ts}')],
  seeds: [join(__dirname, '..', 'database/seeds/*{.js,.ts}')],
  factories: [join(__dirname, '..', 'database/factories/*{.js,.ts}')],
  subscribers: [join(__dirname, '..', 'modules/**/*.subscriber.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
};

export default connectionOptions;
