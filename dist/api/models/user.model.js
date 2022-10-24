"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
function user_model() {
    const users = (0, config_1.query)("users");
    return {
        create: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const exist = yield (0, config_1.connection)().schema.hasTable("users");
                if (!exist) {
                    const created = yield (0, config_1.connection)().schema.createTable("users", (table) => {
                        table.bigIncrements("id").primary();
                        table.text("firstname");
                        table.text("lastname");
                        table.text("email").unique();
                        table.text("password");
                        table.text("bvn");
                        table.text("nin");
                        table.text("phone");
                        table.uuid("user_id").unique();
                        table.dateTime("updatedAt");
                        table.dateTime("createdAt");
                        table.jsonb("metadata");
                    });
                    console.log(created);
                }
            });
        },
        get_user_by_email: function (email) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield (users === null || users === void 0 ? void 0 : users.select("*").where("email", email));
                if (data) {
                    return data[0];
                }
            });
        },
        get_user_by_uuid: function (user_id) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield (users === null || users === void 0 ? void 0 : users.select("*").where("user_id", user_id));
                if (data) {
                    return data[0];
                }
            });
        },
        get_user_and_account_by_email: function (email) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield ((_a = users === null || users === void 0 ? void 0 : users.join("accounts", "users.email", "=", "accounts.email")) === null || _a === void 0 ? void 0 : _a.select("*").where("email", email));
                if (data) {
                    return data[0];
                }
            });
        },
        get_user_and_account_by_uuid: function (user_id) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield ((_a = users === null || users === void 0 ? void 0 : users.join("accounts", "accounts.id", "=", "users.id")) === null || _a === void 0 ? void 0 : _a.select("*").where("id", user_id));
                if (data) {
                    console.log(data);
                    return data[0];
                }
            });
        },
        insert_user: function (payload) {
            return users === null || users === void 0 ? void 0 : users.insert({
                email: payload.email,
                firstname: payload.firstname,
                lastname: payload.lastname,
                password: payload.password,
                user_id: payload.user_id,
                bvn: payload.bvn,
                nin: payload.nin,
                phone: payload.phone,
            });
        },
        update_user: function (user_id, payload) {
            return users.where("user_id", user_id).update(Object.assign({}, payload));
        },
    };
}
exports.default = user_model;
