import dayjs from "dayjs";
export interface File {
    id: number;
    hash?: string;
    minioFileName?: string;
    originFileName?: string;
    fileKey?: number;
    filePath?: string;
    fileUri?: string;
    mime?: string;
    fileType?: string;
    isImage?: number;
    model?: string;
    longitude?: number;
    latitude?: number;
    size?: number;
    fileUrl?: string;
    dateTimeOriginal?: string;
    uploadTime?: dayjs.Dayjs;
    source?: string;
    creatorID?: number;
    creatorName?: string;
    dr?: number;
    ts?: string;
}

