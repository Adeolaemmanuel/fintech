import { BaseModel } from ".";

export type User = {
  firstname: string;
  lastname: string
  email: string;
  password: string;
  user_id: string;
  phone: string;
  bvn?: string;
  nin?: string;
  bank_name?: string;
};
export type UserModel = BaseModel & User;

export interface GenerateAuthToken
  extends Pick<User, "user_id" | "email" | "password"> {}
