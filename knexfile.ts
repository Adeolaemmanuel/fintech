import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      // port: 3306,
      user: "root",
      password: "",
      database: "test",
    },
    migrations: {
      extension: 'ts'
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      // port: 3306,
      user: "root",
      password: "",
      database: "test",
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      // port: 3306,
      user: "root",
      password: "",
      database: "test",
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
