import dayjs from "dayjs";
import { File } from "../types/file";
export function getEmptyFile(): File {
    const file: File = {
        id: 0,
        hash: "",
        minioFileName: "",
        originFileName: "string",
        fileKey: 0,
        filePath: "",
        fileUri: "",
        mime: "",
        fileType: "",
        isImage: 0,
        model: "",
        longitude: 0.01,
        latitude: 0.01,
        size: 0,
        fileUrl: "",
        dateTimeOriginal: dayjs('1970-01-01 00:00:00').format("YYYYMMDDHHmm"),
        uploadTime: dayjs('1970-01-01 00:00:00'),
        source: "",
        creatorID: 0,
        creatorName: "",
        dr: 0,
        ts: "",
    }
    return file;

}