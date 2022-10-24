"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const base_service_1 = __importDefault(require("./base.service"));
const account_model_1 = __importDefault(require("../models/account.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const dotenv = __importStar(require("dotenv"));
const express_validator_1 = require("express-validator");
dotenv.config();
class TransactionService extends base_service_1.default {
    constructor() {
        super({
            baseURL: process.env.RAVEN_BASE_URL,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RAVEN_LIVE_KEY}`,
            },
        });
        this.validateTransferInput = [
            (0, express_validator_1.check)("amount", "Invalid amount").isFloat(),
            (0, express_validator_1.check)("bank", "Invalid bank name").notEmpty().isString(),
            (0, express_validator_1.check)("bank_code", "Invalid bank code").notEmpty().isString(),
            (0, express_validator_1.check)("account_number", "Invalid account number").notEmpty(),
            (0, express_validator_1.check)("account_name", "invalid account name").notEmpty().isString(),
        ];
    }
    static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new TransactionService();
        }
        return this.classInstance;
    }
    generateUserAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = req === null || req === void 0 ? void 0 : req.body;
            const token = yield this.tokenExist(req);
            const { user_id } = this.decrypt(token);
            const user = yield (0, user_model_1.default)().get_user_by_uuid(user_id);
            if (user) {
                const data = {
                    amount: payload === null || payload === void 0 ? void 0 : payload.amount,
                    email: user.email,
                    first_name: user === null || user === void 0 ? void 0 : user.firstname,
                    phone: user === null || user === void 0 ? void 0 : user.phone,
                    last_name: user === null || user === void 0 ? void 0 : user.lastname,
                };
                const resp = yield this.post("pwbt/generate_account", data);
                if (resp) {
                    const data = yield (0, account_model_1.default)().insert_account({
                        account_number: resp === null || resp === void 0 ? void 0 : resp.account_number,
                        account_name: resp === null || resp === void 0 ? void 0 : resp.account_name,
                        bank_name: resp === null || resp === void 0 ? void 0 : resp.bank,
                        user_id,
                        balance: resp.amount,
                    });
                    res.status(200).jsonp({
                        data: resp,
                        status: true,
                        msg: "User account generated successfully",
                    });
                }
            }
        });
    }
    webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            (0, transaction_model_1.default)().update_transaction({
                amount: data.meta.amount,
                reference: data.trx_ref,
                type: data.type,
                status: data.status,
            });
        });
    }
    GetAllBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.get("banks");
            return resp;
        });
    }
    BankLookup() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.get("account_number_lookup");
            return resp;
        });
    }
    GetWalletBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.post("accounts/wallet_balance");
            return res;
        });
    }
    transfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenExist(req);
            const { user_id } = this.decrypt(token);
            const user = (0, user_model_1.default)().get_user_and_account_by_uuid('1');
            const data = req.body;
            data.currency = "NGN";
            const resp = yield this.post("transfers/create", data);
            const dataResp = yield (0, transaction_model_1.default)().insert_transaction({
                amount: resp.amount,
                narration: resp.narration,
                reference: resp.trx_ref,
                status: resp.status,
                type: "Transfer",
                metadata: resp,
            });
            return dataResp;
        });
    }
}
exports.default = TransactionService;
