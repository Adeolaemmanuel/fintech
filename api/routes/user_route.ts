import AuthService from "../services/auth.service";
import express, { Request, Response } from "express";
import BaseService from "../services/base.service";
const router = express.Router();

const authService: AuthService = AuthService.getInstance();
const baseService: BaseService = new BaseService();

router.post(
  "/user-login",
  authService.validateLoginInput,
  async (req: Request, res: Response) => {
    authService.login(req, res);
  }
);

router.post(
  "/user-register",
  authService.validateRegisterInput,
  async (req: Request, res: Response) => {
    authService.register(req, res);
  }
);

router.patch(
  "/update-user",
  baseService.tokenExistMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body;
    authService.updateUser(data, req, res);
  }
);

export default router;
