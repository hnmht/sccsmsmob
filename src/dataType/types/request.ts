import { AxiosRequestConfig } from "axios";

export interface ReqStatus {
    reqLoading: boolean;
}

// export interface CustomRequestConfig<T = any> extends AxiosRequestConfig<T> {
//     isLoading?: boolean;
// };

export interface CustomRequestConfig<T = any> extends AxiosRequestConfig<T> {
    isLoading?: boolean;
}