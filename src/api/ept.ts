import { EPTCache } from "../dataType/types/ept";
import request from "../utils/request";

// Get Execution Project Template list
export function reqGetEPTList(isLoading:boolean = true) {
    return request({
        url: "/ept/list",
        method: 'post',
        isLoading
    });
}

// Get lstest Execution Project Template List for front-end cache
export function reqGetEPTCache(data:EPTCache, isLoading = true) {
    return request({
        url: "/ept/cache",
        method: 'post',
        data,
        isLoading
    });
}
