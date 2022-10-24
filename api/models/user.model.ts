import { User, UserModel } from "../@types/user";
import { connection, query } from "./config";
export default function user_model() {
  const users = query<UserModel>("users");
  return {
    create: async function () {
      const exist = await connection().schema.hasTable("users");
      if (!exist) {
        const created = await connection().schema.createTable(
          "users",
          (table) => {
            table.bigIncrements("id").primary();
            table.text("firstname");
            table.text("lastname");
            table.text("email").unique();
            table.text("password");
            table.text("bvn");
            table.text("nin");
            table.text("phone");
            table.uuid("user_id").unique();
            table.dateTime("updatedAt");
            table.dateTime("createdAt");
            table.jsonb("metadata");
          }
        );
        console.log(created);
      }
    },
    get_user_by_email: async function (email: string) {
      const data = await users?.select("*").where("email", email);
      if (data) {
        return data[0];
      }
    },
    get_user_by_uuid: async function (user_id: string) {
      const data = await users?.select("*").where("user_id", user_id);
      if (data) {
        return data[0];
      }
    },
    get_user_and_account_by_email: async function (email: string) {
      const data = await users
        ?.join("accounts", "users.email", "=", "accounts.email")
        ?.select("*")
        .where("email", email);
      if (data) {
        return data[0];
      }
    },
    get_user_and_account_by_uuid: async function (user_id: string) {
      const data = await users
        ?.join("accounts", "accounts.user_id", "=", "users.user_id")
        ?.select("*")
        .where("user_id", user_id);
      if (data) {
        console.log(data);

        return data[0];
      }
    },
    insert_user: function (payload: Partial<UserModel>) {
      return users?.insert({
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        password: payload.password,
        user_id: payload.user_id,
        bvn: payload.bvn,
        nin: payload.nin,
        phone: payload.phone,
      });
    },
    update_user: function (user_id: string, payload: Partial<UserModel>) {
      return users.where("user_id", user_id).update({
        ...payload,
      });
    },
  };
}
