import { SimpDCCache } from "../dataType/types/dc";
import request from "../utils/request";

// Request document category list from server
export function reqGetDCList(isLoading = true) {
    return request({
        url: "/dc/list",
        method: 'post',
        isLoading
    });
}

// Request simplified document category list from server
export function reqGetSimpDCList(isLoading = true) {
    return request({
        url: "/dc/simplist",
        method: 'post',
        isLoading
    });
}

// Request simplified document category list from front-end cache
export function reqGetSimpDCCache(data:SimpDCCache, isLoading = true) {
    return request({
        url: "/dc/cache",
        method: 'post',
        data,
        isLoading
    });
}



