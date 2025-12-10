import { RLCache } from "../dataType/types/riskLevel";
import request from "../utils/request";

// Get Risk Level list
export function reqGetRLList(isLoading:boolean = true) {
    return request({
        url: "/rl/list",
        method: 'post',
        isLoading
    });
}
// Get latest Risk Level front-end cache
export function reqGetRLsCache(data:RLCache, isLoading:boolean = true) {
    return request({
        url: "/rl/cache",
        method: 'post',
        data,
        isLoading
    });
}
