"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    constructor(option) {
        this._initializeResponseInterceptor = () => {
            this.instance.interceptors.response.use(this._handleResponse, this._handleError);
            this.instanceWithoutAuth.interceptors.response.use(this._handleResponse, this._handleError);
        };
        this._handleResponse = ({ data }) => {
            var _a;
            let response = data;
            if (response.errors) {
                // console.log(response.errors,"errors");
                return Promise.reject(response.errors);
            }
            console.log(response);
            return (_a = response.data) !== null && _a !== void 0 ? _a : response;
        };
        this._handleError = (error) => {
            var _a;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) == 500) {
                return Promise.reject("service provider returns server error");
            }
            console.log(error.response, "response");
            return Promise.reject(error);
        };
        this.instance = axios_1.default.create(option);
        this.instanceWithoutAuth = axios_1.default.create({ baseURL: option === null || option === void 0 ? void 0 : option.baseURL });
        this._initializeResponseInterceptor();
    }
    post(url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instance.post(url, data, config);
        });
    }
    get(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instance.get(url, config);
        });
    }
}
exports.HttpClient = HttpClient;
