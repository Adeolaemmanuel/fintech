import { Account, AccountModel } from "../@types/transaction";
import { connection, query } from "./config";
export default function account_model() {
  const account = query<AccountModel>("accounts");
  return {
    create: async function () {
      const exist = await connection().schema.hasTable("accounts");
      if (!exist) {
        const created = await connection().schema.createTable(
          "accounts",
          (table) => {
            table.bigIncrements("id").primary();
            table.text("account_number").unique();
            table.text("account_name");
            table.text("bank_name");
            table.uuid("user_id").unique();
            table.float("balance"), table.dateTime("updatedAt");
            table.dateTime("createdAt");
            table.jsonb("metadata");
          }
        );
        console.log(created);
      }
    },
    insert_account: async function (payload: Account) {
      const res = await account.insert({
        account_name: payload.account_name,
        account_number: payload.account_number,
        bank_name: payload.bank_name,
        user_id: payload.user_id,
        balance: payload.balance,
      });
      return res;
    },
    get_single_account: async function (user_id: string) {
      const res = await account.select("*").where("user_id", user_id);
      if(res){
        return res[0]
      }
    },
  };
}
