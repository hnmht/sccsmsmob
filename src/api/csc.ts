import { SimpCSCCache } from "../dataType/types/csc";
import request from "../utils/request";

// Get CSC list
export function reqGetCSCList(isLoading:boolean = true) {
    return request({
        url: "/csc/list",
        method: 'post',
        isLoading
    });
}

//Get Simple CSC list
export function reqGetSimpCSCList(isLoading:boolean = true) {
    return request({
        url: "/csc/simplist",
        method: 'post',
        isLoading
    });
}

// Get latest Simple CSC front-end cache
export function reqGetSimpCSCCache(data:SimpCSCCache, isLoading = true) {
    return request({
        url: "/csc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}


