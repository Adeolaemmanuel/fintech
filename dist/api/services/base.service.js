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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("../utils/client");
const user_model_1 = __importDefault(require("../models/user.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
class BaseService extends client_1.HttpClient {
    constructor(option) {
        super(option);
        this.tokenExistMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            try {
                token =
                    req.header("Authorization") ||
                        req.body.headers["Authorization"] ||
                        req.get("authorization") ||
                        req.header("authorization") ||
                        req.body.headers["authorization"] ||
                        req.get("authorization");
                if (!token) {
                    return res === null || res === void 0 ? void 0 : res.status(401).json({ error: "auth token missing", msg: "unauthorized request" });
                }
                req.token = token;
                next();
                // return token;
            }
            catch (error) {
                return res === null || res === void 0 ? void 0 : res.status(401).json({ error: "auth token missing", msg: "unauthorized request" });
            }
        });
        this.tokenExist = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            try {
                token =
                    req.header("Authorization") ||
                        req.body.headers["Authorization"] ||
                        req.get("authorization") ||
                        req.header("authorization") ||
                        req.body.headers["authorization"] ||
                        req.get("authorization");
                if (!token) {
                    res === null || res === void 0 ? void 0 : res.status(401).json({ error: "auth token missing", msg: "unauthorized request" });
                    return;
                }
                // return token;
            }
            catch (error) {
                res === null || res === void 0 ? void 0 : res.status(401).json({ error: "auth token missing", msg: "unauthorized request" });
            }
            return token;
        });
        this.generateRandomNumber = (model, length = 10, alphaNumeric = true) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const givenSet = alphaNumeric
                        ? "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                        : "0123456789";
                    let code = "";
                    for (let i = 0; i < length; i++) {
                        let pos = Math.floor(Math.random() * givenSet.length);
                        code += givenSet[pos];
                    }
                    const resp = yield model();
                    if (resp) {
                        if (resp === code) {
                            this.generateRandomNumber(model, length, alphaNumeric);
                        }
                        else {
                            resolve(code);
                        }
                    }
                }
                catch (error) {
                    console.log(error, "error");
                }
            }));
        });
    }
    static boot() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, user_model_1.default)().create();
            (0, transaction_model_1.default)().create();
            (0, account_model_1.default)().create();
        });
    }
    /**
     * encrypt text
     * @param text
     * @returns
     */
    encrypt(text) {
        const iv = crypto_1.default.randomBytes(16);
        const key = crypto_1.default.randomBytes(32);
        let cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return (iv.toString("hex") +
            "." +
            encrypted.toString("hex") +
            "." +
            key.toString("hex"));
    }
    /**
     * decrypt user auth token
     * @param text
     * @returns user_id, time, email, password
     */
    decrypt(text) {
        const data = text.split(".");
        const iv = Buffer.from(data[0], "hex");
        const key = Buffer.from(data[2], "hex");
        const encryptedText = Buffer.from(data[1], "hex");
        let decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const [user_id, time, email, password] = decrypted.toString().split("::");
        return { user_id, time, email, password };
    }
    /**
     * set expiration date
     * @param minutes
     * @returns Date
     */
    expiresIn(minutes) {
        const now = new Date().getTime();
        return new Date(now + minutes * 60000);
    }
    /**
     * generate user authentication token
     * @param payload
     * @param expires_in
     * @returns string
     */
    generateAuthToken(payload, expires_in = 24 * 60) {
        const { email, password, user_id } = payload;
        const expires = this.expiresIn(expires_in);
        let token = user_id + "::" + expires.getTime() + "::" + email;
        if (password) {
            token = token + "::" + password;
        }
        const encryptedToken = this.encrypt(token);
        return encryptedToken;
    }
    generateUuid() {
        return (0, uuid_1.v4)();
    }
}
exports.default = BaseService;
