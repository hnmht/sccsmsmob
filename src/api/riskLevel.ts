import { PPECache } from "../dataType/types/ppe";
import { APIResponse } from "../dataType/types/response";
import { RiskLevel, RLCache } from "../dataType/types/riskLevel";
import request from "../utils/request";

// Get Risk Level list
export function reqGetRLList(isLoading:boolean = true) :Promise<APIResponse<RiskLevel[]>> {
    return request({
        url: "/rl/list",
        method: 'post',
        isLoading
    });
}
// Get latest Risk Level front-end cache
export function reqGetRLsCache(data:RLCache, isLoading:boolean = true) :Promise<APIResponse<PPECache>> {
    return request({
        url: "/rl/cache",
        method: 'post',
        data,
        isLoading
    });
}
