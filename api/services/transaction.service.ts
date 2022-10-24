import user_model from "../models/user.model";
import { Response } from "express";
import BaseService from "./base.service";
import {
  AllBanksRes,
  GenerateAccountDto,
  GeneratedAccountRes,
  Transaction,
  TransferDto,
  TransferRes,
  WebhookTransferRes,
} from "../@types/transaction";
import account_model from "../models/account.model";
import transaction_model from "../models/transaction.model";
import * as dotenv from "dotenv";
import { check } from "express-validator";
dotenv.config();

class TransactionService extends BaseService {
  private static classInstance?: TransactionService;
  constructor() {
    super({
      baseURL: process.env.RAVEN_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RAVEN_LIVE_KEY}`,
      },
    });
  }
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new TransactionService();
    }
    return this.classInstance;
  }

  validateTransferInput = [
    check("amount", "Invalid amount").isFloat(),
    check("bank", "Invalid bank name").notEmpty().isString(),
    check("bank_code", "Invalid bank code").notEmpty().isString(),
    check("account_number", "Invalid account number").notEmpty(),
    check("account_name", "invalid account name").notEmpty().isString(),
  ];

  async generateUserAccount(req: any, res: Response) {
    const payload: any = req?.body;
    const token = await this.tokenExist(req);
    const { user_id } = this.decrypt(token);
    const user = await user_model().get_user_by_uuid(user_id);
    if (user) {
      const data: GenerateAccountDto = {
        amount: payload?.amount,
        email: user.email,
        first_name: user?.firstname,
        phone: user?.phone,
        last_name: user?.lastname,
      };
      const resp = await this.post<GeneratedAccountRes>(
        "pwbt/generate_account",
        data
      );

      if (resp) {
        const data = await account_model().insert_account({
          account_number: resp?.account_number,
          account_name: resp?.account_name,
          bank_name: resp?.bank,
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
  }

  async webhook(req: any, res: Response) {
    const data: WebhookTransferRes = req.body;
    transaction_model().update_transaction({
      amount: data.meta.amount,
      reference: data.trx_ref,
      type: data.type,
      status: data.status,
    });
  }

  async GetAllBanks() {
    const resp = await this.get<AllBanksRes>("banks");
    return resp;
  }

  async BankLookup() {
    const resp = await this.get<{ name: string }>("account_number_lookup");
    return resp;
  }

  async GetWalletBalance() {
    const res = await this.post("accounts/wallet_balance");
    return res;
  }

  async transfer(req: any, res: Response) {
    const token = await this.tokenExist(req);
    const { user_id } = this.decrypt(token);
    const user = user_model().get_user_and_account_by_uuid(user_id);
    const data: TransferDto = req.body;
    data.currency = "NGN";
    const resp = await this.post<TransferRes>("transfers/create", data);
    const dataResp = await transaction_model().insert_transaction({
      amount: resp.amount,
      narration: resp.narration,
      reference: resp.trx_ref,
      status: resp.status,
      type: "Transfer",
      metadata: resp,
    });
    return dataResp;
  }
}

export default TransactionService;
