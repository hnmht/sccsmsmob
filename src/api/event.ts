import { UserEvents } from "../dataType/types/event";
import request from "../utils/request";
// Get Events for Calendar
export function reqGetEvents(data: UserEvents, isLoading: boolean = true) {
    return request({
        url: "/event/list",
        method: 'post',
        data,
        isLoading
    });
}