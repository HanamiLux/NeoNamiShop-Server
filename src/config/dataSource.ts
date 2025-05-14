import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import {join} from "path";

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [join(__dirname, '../migrations/*{.js,.ts}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',

});