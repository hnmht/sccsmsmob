import { Alert } from "react-native";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    isLoading?: boolean,
};

interface ScResopnseData {
    resKey: string,
    status: boolean,
    msg: string,
    data?: any,
}

const service: AxiosInstance = axios.create({
    baseURL: "/api/v1",
    timeout: 15000,
});

const removeTokenCodes: string[] = ["CodeInvalidToken", "CodeNeedLogin", "CodeTokenDestroy", "CodeLoginOther"];
const successCode: string = "StatusOk";

// Request interceptor
service.interceptors.request.use(
    (config) => {
        const customConfig = config as CustomRequestConfig;
        if (customConfig.isLoading) {
            // store.
        }
        customConfig.url = "";
        customConfig.headers.Authorization = "Bearer ";
        customConfig.headers.XClientType = "scenemob";

        return customConfig;
    },
    (error) => {
        console.log("Axios Request intercrptor failed:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
service.interceptors.response.use(
    (response) => {

        return response;
    }
);



