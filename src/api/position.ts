import { PositionCache } from "../dataType/types/postion";
import request from "../utils/request";

// Get position list
export function reqGetPositionList(isLoading: boolean = true) {
    return request({
        url: "/position/list",
        method: 'post',
        isLoading
    });
}
// Get latest position master data for front-end cache
export function reqGetPositionCache(data: PositionCache, isLoading: boolean = true) {
    return request({
        url: "/position/cache",
        method: 'post',
        data,
        isLoading
    });
}
