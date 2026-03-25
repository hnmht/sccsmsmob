import { Alert } from "react-native";
import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosRequestHeaders,
    InternalAxiosRequestConfig
} from "axios";
import { store } from "../store";
import { i18n } from "../i18n/i18n";
import { requestStart, requestEnd } from "../store/slice/reqStatus";
import { setUserToken } from "../store/slice/user";
import { APIResponse, ResSuccessCode, ResRemoveTokenCodes } from "../dataType/types/response";
import { CustomRequestConfig } from "../dataType//types/request";

const service: AxiosInstance = axios.create({
    timeout: 15000,
    headers: {} as any,
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const c = config as InternalAxiosRequestConfig & { isLoading?: boolean };
        c.headers = (c.headers ?? ({} as AxiosRequestHeaders)) as AxiosRequestHeaders;

        const appInfo = store.getState().appInfo;
        const token = store.getState().user.token;

        // 拼接完整 URL（注意保证 custom.url 是 string | undefined 的正确处理）
        if (typeof c.url === "string") {
            c.url = `${appInfo.serverAddr}${appInfo.globalPath}${c.url}`;
        }

        // loading 管理
        if (c.isLoading) {
            store.dispatch(requestStart());
        }

        // 注入 token（确保 headers 已经存在）
        if (token) {
            (c.headers as any).Authorization = `Bearer ${token}`;
        }

        // 自定义 header
        (c.headers as any).XClientType = "scenemob";

        // 语言
        (c.headers as any)["Accept-Language"] = i18n.language;

        // 最后返回 c（它是 InternalAxiosRequestConfig & { isLoading?: boolean }）
        // 该返回类型兼容 InternalAxiosRequestConfig，拦截器类型检查通过
        return c;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // response.config 应该是 InternalAxiosRequestConfig（axios 在内部转换）
        const config = response.config as InternalAxiosRequestConfig & { isLoading?: boolean };

        if (config.isLoading) {
            store.dispatch(requestEnd());
        }
        const res: APIResponse<any> = response.data;
        // 注入 status 帮业务判断是否成功
        res.status = res.resKey === ResSuccessCode;

        if (!res.status) {
            Alert.alert(i18n.t("error"), res.msg || "请求返回错误", [{ text: "OK" }], { cancelable: false });
            if (ResRemoveTokenCodes.includes(res.resKey)) {
                store.dispatch(setUserToken(""));
            }
        }

        // 把标准化后的 res 放回 response.data
        response.data = res;
        return response;
    },
    (err) => {
        console.error("出错:",err);
        Alert.alert(
            i18n.t("error"),
            err?.message === "Network Error" ? "网络错误，请检查设备网络！" : "连接服务器失败，请稍后再试！"
        );
        return Promise.reject(err);
    }
);


export default function request<T = any>(config: CustomRequestConfig): Promise<APIResponse<T>> {
    // 在调用 service 之前，确保 config.headers 存在（以防用户在调用时传了 explicit undefined）
    config.headers = config.headers ?? ({} as AxiosRequestHeaders);
    // 将 config 断言为 InternalAxiosRequestConfig 传入 axios（axios 内部会做转换）
    return service(config as InternalAxiosRequestConfig).then((response: AxiosResponse<APIResponse<T>>) => response.data);
}

