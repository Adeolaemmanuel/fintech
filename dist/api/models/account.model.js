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
function account_model() {
    const account = (0, config_1.query)("accounts");
    return {
        create: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const exist = yield (0, config_1.connection)().schema.hasTable("accounts");
                if (!exist) {
                    const created = yield (0, config_1.connection)().schema.createTable("accounts", (table) => {
                        table.bigIncrements("id").primary();
                        table.text("account_number").unique();
                        table.text("account_name");
                        table.text("bank_name");
                        table.uuid("user_id").unique();
                        table.float("balance"), table.dateTime("updatedAt");
                        table.dateTime("createdAt");
                        table.jsonb("metadata");
                    });
                    console.log(created);
                }
            });
        },
        insert_account: function (payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield account.insert({
                    account_name: payload.account_name,
                    account_number: payload.account_number,
                    bank_name: payload.bank_name,
                    user_id: payload.user_id,
                    balance: payload.balance,
                });
                return res;
            });
        },
        get_single_account: function (user_id) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield account.select("*").where("user_id", user_id);
                if (res) {
                    return res[0];
                }
            });
        },
    };
}
exports.default = account_model;
