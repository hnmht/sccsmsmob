import { ConstructionSiteOptionCache } from "../dataType/types/cso";
import request from "../utils/request";

// Get Construction Site Options
export function reqGetCSOs(isLoading = true) {
    return request({
        url: "/cso/options",
        method: "post",
        isLoading
    });
}

// Get CSO front-end Cache
export function reqGetCSOCache(data:ConstructionSiteOptionCache, isLoading = true) {
    return request({
        url: "/cso/cache",
        method: 'post',
        data,
        isLoading
    });
}