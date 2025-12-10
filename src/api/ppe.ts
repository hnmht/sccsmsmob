import { PPECache } from "../dataType/types/ppe";
import request from "../utils/request";

// Get Personal Protective Equipment list
export function reqGetPPEList(isLoading: boolean = true) {
    return request({
        url: "/ppe/list",
        method: 'post',
        isLoading
    });
}
// Get PPE front-end cache
export function reqGetPPECache(data: PPECache, isLoading: boolean = true) {
    return request({
        url: "/ppe/cache",
        method: 'post',
        data,
        isLoading
    });
}
