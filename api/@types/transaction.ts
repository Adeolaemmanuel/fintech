import { BaseModel, Currency } from ".";

export type Account = {
  user_id: string;
  account_number: string;
  account_name?: string;
  bank_name?: string;
  balance?: number;
};
export type AccountModel = BaseModel & Account;

export type Transaction = {
  user_id?: string;
  amount: number;
  reference?: string;
  narration?: string;
  type?: string;
  status?: string;
};
export type TransactionModel = BaseModel & Transaction;

export type GenerateAccountDto = {
  first_name: string;
  last_name?: string;
  phone: string;
  amount: string;
  email: string;
};

export type GeneratedAccountRes = {
  account_number: string;
  account_name: string;
  bank: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  isPermanent: false;
  amount: number;
};

export type WebhookTransferRes = {
  merchant_ref: string;
  meta: {
    account_name: string;
    account_number: string;
    narration: string;
    currency: string;
    amount: number;
  };
  trx_ref: string;
  secret: string;
  status: string;
  session_id: string;
  type: string;
  response: string;
};

export type TransferRes = {
  email: string;
  trx_ref: string;
  merchant_ref: string;
  amount: number;
  bank: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration: string;
  fee: string;
  status: string;
  created_at: string;
  id: number;
};

export type TransferDto = {
  amount: number;
  bank: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration?: string;
  reference?: string;
  currency?: Currency;
};

export type AllBanksRes = { code: string; name: string }[];
