import BaseService from "../services/base.service";
import express, { Request, Response } from "express";
import TransactionService from "../services/transaction.service";
const router = express.Router();
const transactionService: TransactionService = TransactionService.getInstance();
const baseService: BaseService = new BaseService();

router.post(
  "/generate-account",
  baseService.tokenExistMiddleware,
  async (req: Request, res: Response) => {
    await transactionService.generateUserAccount(req, res);
  }
);

router.post(
  "/transfer",
  transactionService.validateTransferInput,
  baseService.tokenExistMiddleware,
  async (req: Request, res: Response) => {
    await transactionService.transfer(req, res);
  }
);

router.post(
  "/transfer-webhook",
  baseService.tokenExistMiddleware,
  async (req: Request, res: Response) => {
    await transactionService.webhook(req, res);
  }
);

export default router;
