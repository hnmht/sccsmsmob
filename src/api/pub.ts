import request from "../utils/request";

// Get Public System Information
export function reqPubSysInfo( isLoading: boolean = true) {
    return request({
        url: "/pub/sysinfo",
        method: "post",
        isLoading
    });
}