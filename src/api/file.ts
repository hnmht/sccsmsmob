import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";
import { File } from "../dataType/types/file";
// Upload Files
export function reqUploadFiles(data: FormData, isLoading: boolean = true):Promise<APIResponse<File[]>> {
    return request({
        url: "/file/receive",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data,
        isLoading
    });
}
// Get file detail by file hash
export function reqGetFileByHash(data: File, isLoading: boolean = true):Promise<APIResponse<File>> {
    return request({
        url: "/file/getfilebyhash",
        method: "post",
        data,
        isLoading
    });
}

// Get file details by hash array
export function reqGetFilesByHash(data: File[], isLoading: boolean = true):Promise<APIResponse<File[]>> {
    return request({
        url: "/file/getfilesbyhash",
        method: "post",
        data,
        isLoading
    });
}