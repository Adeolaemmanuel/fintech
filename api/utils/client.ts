import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

declare module "axios" {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  protected readonly instanceWithoutAuth: AxiosInstance;

  constructor(option?: AxiosRequestConfig) {
    this.instance = axios.create(option);
    this.instanceWithoutAuth = axios.create({ baseURL: option?.baseURL });
    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
    this.instanceWithoutAuth.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => {
    let response: any = data;
    if (response.errors) {
      // console.log(response.errors,"errors");
      return Promise.reject(response.errors);
    }
    console.log(response);
    return response.data ?? response;
  };

  private _handleError = (error: AxiosError) => {
    if (error.response?.status == 500) {
      return Promise.reject("service provider returns server error");
    }
    console.log(error.response, "response");
    return Promise.reject(error);
  };

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }
}
