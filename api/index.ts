import express from "express";
import pkg from "body-parser";
import BaseService from "./services/base.service";
import authRouter from "./routes/user_route";
import transRouter from "./routes/transaction_route";

const app = express();
const cors = require("cors");

app.use(pkg.json());
app.use(cors());

BaseService.boot();

app.use("/api/auth", authRouter);
app.use("/api/transaction", transRouter);

const port = 3000;
const host = "http://localhost";
app.listen(port, () => {
  console.log(`\nServer listening on ${host}:${port}\n`);
});
