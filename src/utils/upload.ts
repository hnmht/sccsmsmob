import { Platform } from "react-native";

type UploadFilePart = {
    uri: string;
    type: string;
    name: string;
};

export function normalizeUploadUri(uri: string): string {
    if (!uri) {
        return uri;
    }
    if (uri.startsWith("content://") || uri.startsWith("file://")) {
        return uri;
    }
    if (Platform.OS === "android") {
        return `file://${uri}`;
    }
    return uri;
}

export function createUploadFilePart(uri: string, type: string, name: string): UploadFilePart {
    return {
        uri: normalizeUploadUri(uri),
        type,
        name
    };
}
