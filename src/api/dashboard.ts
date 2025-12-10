import { DashBoardData, RiskTrendData } from "../dataType/types/dashboard";
import request from "../utils/request";

// Get Dashboard data
export function reqGetDashboardData(data:DashBoardData,isLoading:boolean = true) {
    return request({
        url: "/da/data",
        method: 'post',
        data,
        isLoading
    });
}


// Get Risk Trend data
export function reqGetRiskTrend(data:RiskTrendData, isLoading:boolean = false) {
    return request({
        url: "/da/risktrend",
        method: 'post',
        data,
        isLoading
    });
}