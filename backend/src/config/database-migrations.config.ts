import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: './.env.dev' });
console.log(process.env.DB_TYPE);

const options = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_LOCAL_HOST || 'localhost',
  port: +process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'db',
  username: process.env.DB_USERNAME || 'pguser',
  password: process.env.DB_PASSWORD || 'pguser',
  entities: ['src/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migrations_typeorm',
  migrations: ['src/database/migrations/*{.ts,.js}'],
  logging: true,
};

console.log(options);
const connectionSource = new DataSource(options as DataSourceOptions);

export default connectionSource;
