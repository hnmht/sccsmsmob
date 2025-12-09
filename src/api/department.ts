import { SimpDeptCache } from "../dataType/types/department";
import request from "../utils/request";

// Get Department list
export function reqGetDepts(isLoading: boolean = true) {
    return request({
        url: "/dept/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Department list
export function reqGetSimpDepts(isLoading: boolean = true) {
    return request({
        url: "/dept/simplist",
        method: 'post',
        isLoading
    });
}

// Get Simple Department latest front-end cache
export function reqGetSimpDeptsCache(data: SimpDeptCache, isLoading = true) {
    return request({
        url: "/dept/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

