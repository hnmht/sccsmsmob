import request from "../utils/request";

// Get User Infomation
export function reqUserInfo(data: string, isLoading = true) {
    return request({
        url: "/user/info",
        method: "post",
        data,
        isLoading
    });
}

// Change User's avatar
export function reqChangeAvatar(data: FormData, isLoading = true) {
    return request({
        url: "/user/changeavatar",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data,
        isLoading
    })
}

