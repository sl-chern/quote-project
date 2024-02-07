import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from 'src/types/DatabaseConfig';

export default registerAs(
  'db',
  (): DatabaseConfig => ({
    type: process.env.DB_TYPE || 'postgres',
    //url: process.env.DB_URL || 'postgres://user:password@localhost/db',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'db',
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
  }),
);
