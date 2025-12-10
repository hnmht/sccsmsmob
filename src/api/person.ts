import { PersonCache } from "../dataType/types/person";
import request from "../utils/request";

// Get Person list
export function reqGetPersons(isLoading: boolean = true) {
    return request({
        url: "/person/list",
        method: 'post',
        isLoading
    });
}

// Get latest Person front-end cache
export function reqGetPersonsCache(data:PersonCache, isLoading:boolean = true) {
    return request({
        url: "/person/cache",
        method: "post",
        data,
        isLoading
    })
}

