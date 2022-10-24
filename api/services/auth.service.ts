import { User } from "../@types/user";
import { check } from "express-validator";
import BaseService from "./base.service";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import user_model from "../models/user.model";

class AuthService extends BaseService {
  private static classInstance?: AuthService;
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new AuthService();
    }
    return this.classInstance;
  }

  validateLoginInput = [
    check("email", "Please enter a valid email").notEmpty().isEmail(),
    check(
      "password",
      "Password must start with uppercase, have symbols and numbers"
    ).isStrongPassword({ minLength: 7, minSymbols: 1, minUppercase: 1 }),
  ];

  validateRegisterInput = [
    check("email", "Please enter a valid email").notEmpty().isEmail(),
    check("firstname", "Please enter a name").notEmpty(),
    check("lastname", "Please enter a name").notEmpty(),
    check("phone", "Please enter valid phone number").notEmpty(),
    check(
      "password",
      "Password must start with uppercase, have symbols and numbers"
    ).isStrongPassword({ minLength: 7, minSymbols: 1, minUppercase: 1 }),
  ];

  async register(req: Request, res: Response) {
    const payload: Partial<User> = req.body;
    const salt = await bcrypt.genSalt(10);
    console.log(payload);

    const resp = await user_model().insert_user({
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      password: await bcrypt.hash(payload?.password as string, salt),
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
  }

  async login(req: Request, res: Response) {
    const payload: Pick<User, "email" | "password"> = req.body;
    const user = await user_model().get_user_by_email(payload.email);
    if (user) {
      const isUser = await bcrypt.compareSync(payload.password, user.password);
      if (isUser) {
        res.status(200).jsonp({
          data: {
            ...user,
            accessToken: this.generateAuthToken({
              email: user.email,
              password: user.password,
              user_id: user.user_id,
            }),
          },
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
    }else{
      res.status(401).jsonp({data: {}, status: false, msg: 'User does not exist'})
    }
  }

  async updateUser(payload: Partial<User>, req: Request, res: Response) {
    const token = await this.tokenExist(req);
    if (token) {
      const { user_id } = this.decrypt(token);
      const data = await user_model().get_user_by_uuid(user_id);
      if (data) {
        user_model().update_user(user_id, payload as User);
      }
    }
  }
}

export default AuthService;
