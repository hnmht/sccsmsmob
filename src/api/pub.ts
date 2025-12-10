import { FrontDBInfo } from "../dataType/types/public";
import request from "../utils/request";

// Get Public System Information
export function reqPubSysInfo(isLoading: boolean = true) {
    return request({
        url: "/pub/sysinfo",
        method: "post",
        isLoading
    });
}

// Generate front-end DBID
export function reqGenerateFrontDBID(data: FrontDBInfo, isLoading: boolean = true) {
    return request({
        url: "/pub/addfrontdbid",
        method: "post",
        data,
        isLoading
    });
}

// Get front-end DBID
export function reqGetFrontDBID(data: FrontDBInfo, isLoading: boolean = true) {
    return request({
        url: "/pub/getfrontdbid",
        method: "post",
        data,
        isLoading
    });
}