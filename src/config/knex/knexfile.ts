import type { Knex } from "knex";
import { 
  DB_CLIENT, 
  DB_HOST, 
  DB_NAME, 
  DB_PASSWORD, 
  DB_PORT, 
  DB_USER 
} from "../constants.js";

const knexConfig: Record<string, Knex.Config> = {
  development: {
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    migrations: {
      directory: '../../migrations',
    },
  },
};

export default knexConfig;