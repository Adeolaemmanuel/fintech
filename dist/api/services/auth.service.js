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
const express_validator_1 = require("express-validator");
const base_service_1 = __importDefault(require("./base.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthService extends base_service_1.default {
    constructor() {
        super(...arguments);
        this.validateLoginInput = [
            (0, express_validator_1.check)("email", "Please enter a valid email").notEmpty().isEmail(),
            (0, express_validator_1.check)("password", "Password must start with uppercase, have symbols and numbers").isStrongPassword({ minLength: 7, minSymbols: 1, minUppercase: 1 }),
        ];
        this.validateRegisterInput = [
            (0, express_validator_1.check)("email", "Please enter a valid email").notEmpty().isEmail(),
            (0, express_validator_1.check)("firstname", "Please enter a name").notEmpty(),
            (0, express_validator_1.check)("lastname", "Please enter a name").notEmpty(),
            (0, express_validator_1.check)("phone", "Please enter valid phone number").notEmpty(),
            (0, express_validator_1.check)("password", "Password must start with uppercase, have symbols and numbers").isStrongPassword({ minLength: 7, minSymbols: 1, minUppercase: 1 }),
        ];
    }
    static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new AuthService();
        }
        return this.classInstance;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            const salt = yield bcrypt_1.default.genSalt(10);
            console.log(payload);
            const resp = yield (0, user_model_1.default)().insert_user({
                email: payload.email,
                firstname: payload.firstname,
                lastname: payload.lastname,
                password: yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, salt),
                user_id: this.generateUuid(),
                bvn: payload.bvn,
                nin: payload.nin,
                phone: payload.phone,
            });
            if (resp) {
                res
                    .status(200)
                    .jsonp({ msg: "User created successfully", status: true, data: [] });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            const user = yield (0, user_model_1.default)().get_user_by_email(payload.email);
            if (user) {
                const isUser = yield bcrypt_1.default.compareSync(payload.password, user.password);
                if (isUser) {
                    res.status(200).jsonp({
                        data: Object.assign(Object.assign({}, user), { accessToken: this.generateAuthToken({
                                email: user.email,
                                password: user.password,
                                user_id: user.user_id,
                            }) }),
                        status: false,
                        msg: "User logged in successfully",
                    });
                    return;
                }
                res.status(401).jsonp({
                    msg: "Invalid user details",
                    status: false,
                    error: {},
                });
            }
            else {
                res.status(401).jsonp({ data: {}, status: false, msg: 'User does not exist' });
            }
        });
    }
    updateUser(payload, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenExist(req);
            if (token) {
                const { user_id } = this.decrypt(token);
                const data = yield (0, user_model_1.default)().get_user_by_uuid(user_id);
                if (data) {
                    (0, user_model_1.default)().update_user(user_id, payload);
                }
            }
        });
    }
}
exports.default = AuthService;
