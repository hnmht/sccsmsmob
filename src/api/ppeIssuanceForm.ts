import { QueryParams } from "../dataType/types/public";
import request from "../utils/request";

// Get PPE Issuance Form List
export function reqGetPPEIFList(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/ppeif/list",
        method: 'post',
        data,
        isLoading
    });
}
// Get PPE Issuance Form Report
export function reqGetPPEIFReport(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/ppeif/rep",
        method: 'post',
        data,
        isLoading
    });
}

