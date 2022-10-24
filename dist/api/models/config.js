"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.connection = void 0;
const knex_1 = __importDefault(require("knex"));
function connection() {
    const app = (0, knex_1.default)({
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
    return app;
}
exports.connection = connection;
function query(table) {
    const app = (0, knex_1.default)({
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
    return app(table);
}
exports.query = query;
