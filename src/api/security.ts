import request from "../utils/request";

// Get RSA Public key
export function reqGetPublicKey(isLoading: boolean = true) {
    return request({
        url: "/auth/publickey",
        method: "post",
        isLoading
    });
}