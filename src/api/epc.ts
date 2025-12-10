import { SimpEPCCache } from "../dataType/types/epc";
import request from "../utils/request";

// Get Execution Project Category list
export function reqGetEPCList(isLoading:boolean = true) {
    return request({
        url: "/epc/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Execution Project Category list
export function reqGetSimpEPCList(isLoading:boolean = true) {
    return request({
        url: "/epc/simplist",
        method: 'post',
        isLoading
    });
}

// Get SimpEPC front-end cache
export function reqGetSimpEPCCache(data:SimpEPCCache, isLoading:boolean = true) {
    return request({
        url: "/epc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}


