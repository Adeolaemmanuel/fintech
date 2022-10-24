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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authService = auth_service_1.default.getInstance();
router.post("/user-login", authService.validateLoginInput, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    authService.login({
        email: data.email,
        password: data.password,
    }, req, res);
}));
router.post("/user-register", authService.validateRegisterInput, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    authService.register({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
    }, req, res);
}));
exports.default = router;
