import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { GenerateAuthToken } from "api/@types/user";
import { HttpClient } from "../utils/client";
import { AxiosRequestConfig } from "axios";
import { NextFunction, Response } from "express";
import user_model from "../models/user.model";
import transaction_model from "../models/transaction.model";
import account_model from "../models/account.model";

class BaseService extends HttpClient {
  constructor(option?: AxiosRequestConfig) {
    super(option);
  }
  static async boot() {
    user_model().create();
    transaction_model().create();
    account_model().create();
  }

  /**
   * encrypt text
   * @param text
   * @returns
   */
  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const key = crypto.randomBytes(32);
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return (
      iv.toString("hex") +
      "." +
      encrypted.toString("hex") +
      "." +
      key.toString("hex")
    );
  }

  /**
   * decrypt user auth token
   * @param text
   * @returns user_id, time, email, password
   */
  decrypt(text: string) {
    const data = text.split(".");
    const iv = Buffer.from(data[0], "hex");
    const key = Buffer.from(data[2], "hex");
    const encryptedText = Buffer.from(data[1], "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const [user_id, time, email, password] = decrypted.toString().split("::");
    return { user_id, time, email, password };
  }

  tokenExistMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    let token;
    try {
      token =
        req.header("Authorization") ||
        req.body.headers["Authorization"] ||
        req.get("authorization") ||
        req.header("authorization") ||
        req.body.headers["authorization"] ||
        req.get("authorization");
      if (!token) {
        return res
          ?.status(401)
          .json({ error: "auth token missing", msg: "unauthorized request" });
      }
      req.token = token;
      next();
      // return token;
    } catch (error) {
      return res
        ?.status(401)
        .json({ error: "auth token missing", msg: "unauthorized request" });
    }
  };

  tokenExist = async (req: any, res?: Response, next?: NextFunction) => {
    let token;
    try {
      token =
        req.header("Authorization") ||
        req.body.headers["Authorization"] ||
        req.get("authorization") ||
        req.header("authorization") ||
        req.body.headers["authorization"] ||
        req.get("authorization");
      if (!token) {
        res
          ?.status(401)
          .json({ error: "auth token missing", msg: "unauthorized request" });
        return;
      }
      // return token;
    } catch (error) {
      res
        ?.status(401)
        .json({ error: "auth token missing", msg: "unauthorized request" });
    }
    return token;
  };

  /**
   * set expiration date
   * @param minutes
   * @returns Date
   */
  expiresIn(minutes: any) {
    const now = new Date().getTime();
    return new Date(now + minutes * 60000);
  }

  /**
   * generate user authentication token
   * @param payload
   * @param expires_in
   * @returns string
   */
  generateAuthToken(payload: GenerateAuthToken, expires_in: number = 24 * 60) {
    const { email, password, user_id } = payload;
    const expires = this.expiresIn(expires_in);
    let token = user_id + "::" + expires.getTime() + "::" + email;
    if (password) {
      token = token + "::" + password;
    }
    const encryptedToken = this.encrypt(token);
    return encryptedToken;
  }

  generateUuid() {
    return uuidv4();
  }

  generateRandomNumber = async (model: any, length = 10, alphaNumeric = true) =>
    new Promise(async (resolve, reject) => {
      try {
        const givenSet = alphaNumeric
          ? "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
          : "0123456789";

        let code = "";
        for (let i = 0; i < length; i++) {
          let pos = Math.floor(Math.random() * givenSet.length);
          code += givenSet[pos];
        }
        const resp = await model();
        if (resp) {
          if (resp === code) {
            this.generateRandomNumber(model, length, alphaNumeric);
          } else {
            resolve(code);
          }
        }
      } catch (error) {
        console.log(error, "error");
      }
    });
}

export default BaseService;
