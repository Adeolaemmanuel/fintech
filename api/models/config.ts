import knex from "knex";
import * as dotenv from "dotenv";
dotenv.config();

export function connection() {
  const app = knex({
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      // port: 3306,
      user: process.env.DB_USER,
      password: "",
      database: process.env.DB_NAME,
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    log: {
      warn(message) {
        console.log(message);
      },
      error(message) {
        console.log(message);
      },
      deprecate(message) {
        console.log(message);
      },
      debug(message) {
        console.log(message);
      },
    },
  });
  return app;
}

export function query<T extends {}>(table: string) {
  const app = knex({
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      // port: 3306,
      user: "root",
      password: "",
      database: "test",
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    log: {
      warn(message) {
        console.log(message);
      },
      error(message) {
        console.log(message);
      },
      deprecate(message) {
        console.log(message);
      },
      debug(message) {
        console.log(message);
      },
    },
  });
  return app<T>(table);
}
