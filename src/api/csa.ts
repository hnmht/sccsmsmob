import { ConstructionSiteCache } from "../dataType/types/csa";
import request from "../utils/request";

// Get Construction Site master data list
export function reqGetCSList(isLoading:boolean = true) {
    return request({
        url: "/csa/list",
        method: 'post',
        isLoading
    });
}

// Get Construction Site front-end cache
export function reqGetCSCache(data:ConstructionSiteCache, isLoading = true) {
    return request({
        url: "/csa/cache",
        method: 'post',
        data,
        isLoading
    });
}

