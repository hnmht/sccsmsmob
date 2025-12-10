import { QueryParams } from "../dataType/types/public";
import request from "../utils/request";

// Get Training Record List
export function reqGetTRList(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/tr/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get Taught Lessons Report
export function reqGetTaughtLessonsReport(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/tr/tlrep",
        method: 'post',
        data,
        isLoading
    });
}

// Get Recived Training Report
export function reqGetRecivedTrainingReport(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/tr/rtrep",
        method: 'post',
        data,
        isLoading
    });
}