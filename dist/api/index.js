"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const base_service_1 = __importDefault(require("./services/base.service"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const transaction_route_1 = __importDefault(require("./routes/transaction_route"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(body_parser_1.default.json());
app.use(cors());
base_service_1.default.boot();
app.use("/api/auth", user_route_1.default);
app.use("/api/transaction", transaction_route_1.default);
const port = 3000;
const host = "http://localhost";
app.listen(port, () => {
    console.log(`\nServer listening on ${host}:${port}\n`);
});
