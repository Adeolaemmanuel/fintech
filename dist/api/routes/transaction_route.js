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
const base_service_1 = __importDefault(require("../services/base.service"));
const express_1 = __importDefault(require("express"));
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const router = express_1.default.Router();
const transactionService = transaction_service_1.default.getInstance();
const baseService = new base_service_1.default();
router.post("/generate-account", baseService.tokenExistMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionService.generateUserAccount(req, res);
}));
router.post("/transfer", transactionService.validateTransferInput, baseService.tokenExistMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionService.transfer(req, res);
}));
router.post("/transfer-webhook", baseService.tokenExistMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionService.webhook(req, res);
}));
exports.default = router;
