import { Transaction, TransactionModel } from "api/@types/transaction";
import { connection, query } from "./config";
export default function transaction_model() {
  const transaction = query<TransactionModel>("transactions");
  return {
    create: async function () {
      const exist = await connection().schema.hasTable("transactions");
      if (!exist) {
        const created = await connection().schema.createTable(
          "transactions",
          (table) => {
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
          }
        );
        console.log(created);
      }
    },
    insert_transaction: async function (payload: TransactionModel) {
      transaction.insert({
        ...payload,

      });
    },
    update_transaction: async function (payload: TransactionModel) {
      return transaction.where("reference", payload.reference).update({
        ...payload,
      });
    },
  };
}
