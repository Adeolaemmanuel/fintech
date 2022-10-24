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
function transaction_model() {
    const transaction = (0, config_1.query)("transactions");
    return {
        create: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const exist = yield (0, config_1.connection)().schema.hasTable("transactions");
                if (!exist) {
                    const created = yield (0, config_1.connection)().schema.createTable("transactions", (table) => {
                        table.bigIncrements("id").primary();
                        table.float("amount");
                        table.text("narration"),
                            table.text("status"),
                            table.text("type"),
                            table.uuid("user_id");
                        table.dateTime("updatedAt");
                        table.dateTime("createdAt");
                        table.jsonb("metadata");
                        table.text("reference");
                    });
                    console.log(created);
                }
            });
        },
        insert_transaction: function (payload) {
            return __awaiter(this, void 0, void 0, function* () {
                transaction.insert(Object.assign({}, payload));
            });
        },
        update_transaction: function (payload) {
            return __awaiter(this, void 0, void 0, function* () {
                return transaction.where("reference", payload.reference).update(Object.assign({}, payload));
            });
        },
    };
}
exports.default = transaction_model;
