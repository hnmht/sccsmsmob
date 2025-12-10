import request from "../utils/request";
// Upload Files
export function reqUploadFiles(data: FormData, isLoading: boolean = true) {
    return request({
        url: "/file/receive",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data,
        isLoading
    });
}
// Get file detail by file hash
export function reqGetFileByHash(data: File, isLoading: boolean = true) {
    return request({
        url: "/file/getfilebyhash",
        method: "post",
        data,
        isLoading
    });
}

// Get file details by hash array
export function reqGetFilesByHash(data: File[], isLoading: boolean = true) {
    return request({
        url: "/file/getfilesbyhash",
        method: "post",
        data,
        isLoading
    });
}