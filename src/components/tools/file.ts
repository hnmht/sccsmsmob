// import jsSHA from "jssha";
import { Buffer } from "buffer"
import { dayjs } from "../../i18n/i18n";
import RNFS from "react-native-fs";
import { Platform } from "react-native";
import RNPhotoManipulator from "react-native-photo-manipulator";
import { Image } from "react-native-image-crop-picker";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { checkIsImage } from "./image";
import { MarkText, Location } from "../../dataType/types/scInput";
import { ScFile } from "../../dataType/types/file";

// Get ScFile name and file type
function parseFileName(path: string) {
    const originFileName = path.split("/").pop() ?? "unknown"
    const ext = originFileName.includes(".") ? originFileName.slice(originFileName.lastIndexOf(".")) : ""
    return { originFileName, ext }
}
// Read ScFile Header
export async function readFileHeader(path: string, length = 64): Promise<Uint8Array> {
    const base64 = await RNFS.read(path, length, 0, "base64");
    return Uint8Array.from(Buffer.from(base64, "base64"))
}
// Read Image Create time
function resolveDateTime(file: Image) {
    if (file.exif?.DateTimeDigitized) {
        return dayjs(file.exif.DateTimeDigitized, "YYYY:MM:DD HH:mm:ss")
            .format("YYYYMMDDHHmm")
    }

    const ts =
        Platform.OS === "ios"
            ? Number(file.creationDate)
            : Number(file.modificationDate)

    return dayjs(ts || Date.now()).format("YYYYMMDDHHmm")
}
// Read Image location
function resolveLocation(file: Image) {
    let latitude: number = 0.01;
    let longitude: number = 0.01;

    if (file.exif?.Latitude) {
        latitude = file.exif.Latitude;
    }
    if (file.exif?.Longitude) {
        longitude = file.exif.Longitude
    }
    return { latitude, longitude };
};
export const getFileInfo = async (file: DocumentPickerResponse): Promise<ScFile> => {
    const filePath = file.uri;
    const { originFileName, ext } = parseFileName(filePath);
    //解决中文文件名无法读取问题
    // const pos = file.fileCopyUri.lastIndexOf("/");
    // const filePath = file.fileCopyUri.substr(0, pos) + "/" + name;
    const hash = await RNFS.hash(filePath, "sha256");
    return {
        id: 0,
        originFileName,
        mime: ext,
        fileType: ext,
        filePath,
        hash,
        isImage: 0,
        model: "unknown",
        dateTimeOriginal: dayjs().format("YYYYMMDDHHmm"),
        latitude: 0.01,
        longitude: 0.01,
        fileUrl: "",
        source: "",
        dr: 0
    };
};
//图片水印文本字体
export const markFontOptions = {
    fontSize: 16,
    textColor: "#FFFAFA",
    margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    },
    rowHeight: 22,
};
const buildTextBlock = (
    texts: string[],
    startX: number,
    startY: number,
    options = markFontOptions
): MarkText[] => {
    return texts.map((text, index) => ({
        position: {
            x: startX,
            y: startY + index * options.rowHeight,
        },
        text,
        textSize: options.fontSize,
        color: options.textColor,
    }));
};
const estimateTextWidth = (texts: string[], fontSize: number) => {
    const maxLength = Math.max(...texts.map(t => t.length));
    // 中文 ≈ fontSize，英文 ≈ 0.6 * fontSize
    return maxLength * fontSize;
};
// Add Water Mark in an image
export const imageAddWaterMark = async (file: Image, markTexts: MarkText[], currentLocation: Location): Promise<ScFile> => {
    const filePath = file.path;
    const imageInfo = await readImageInfo(file);
    // Return immediately if no size is provided
    if (!file.width || !file.height) {
        return imageInfo;
    }
    const marks: MarkText[] = [];
    // Top-left corner, business watermark
    marks.push(
        ...buildTextBlock(
            markTexts.map(t => t.text),
            markFontOptions.margin.left,
            markFontOptions.margin.top
        )
    );
    // Bottom-right: Photo info watermark
    const infoTexts = [
        `经度：${currentLocation.longitude}`,
        `纬度：${currentLocation.latitude}`,
        `${dayjs().format("YY-MM-DD HH:mm")} | 现场拍照`,
    ];

    const blockHeight =
        infoTexts.length * markFontOptions.rowHeight;

    const blockWidth = estimateTextWidth(
        infoTexts,
        markFontOptions.fontSize
    );
    const startX =
        file.width - blockWidth - markFontOptions.margin.right;
    const startY =
        file.height - blockHeight - markFontOptions.margin.bottom;

    marks.push(
        ...buildTextBlock(infoTexts, startX, startY)
    );
    const markImagePath = await RNPhotoManipulator.printText(
        filePath,
        marks
    );

    imageInfo.filePath = markImagePath;

    return imageInfo;
};

// Get Image info
export const readImageInfo = async (file: Image): Promise<ScFile> => {
    const filePath = file.path;
    const { originFileName, ext } = parseFileName(filePath);
    const header = await readFileHeader(filePath, 64);
    const typeInfo = checkIsImage(header);
    const hash = await RNFS.hash(file.path, "sha256");
    const isImage = typeInfo.isImage ? 1 : 0;
    const fileType = typeInfo.isImage ? typeInfo.type : ext;
    const model = file.exif?.Model ?? "unknown";
    const dateTimeOriginal = resolveDateTime(file);
    const { latitude, longitude } = resolveLocation(file);
    const mime = file.mime;
    return {
        id: 0,
        fileKey: 0,
        originFileName,
        fileType,
        mime,
        filePath,
        hash,
        isImage,
        model,
        dateTimeOriginal,
        latitude,
        longitude,
        fileUrl: "",
        source: "",
        dr: 0
    };
};

//获取CropImage文件信息
// export const getCropImageInfo = async (file: Image) => {
//     const { name, ext } = parseFileName(file.path);
//     const header = await readFileHeader(file.path, 64);
//     const typeInfo = checkIsImage(header);
//     const fileHash = await RNFS.hash(file.path, "sha256");
//     const isImage = typeInfo.isImage ? 1 : 0
//     const fileType = typeInfo.isImage ? typeInfo.type : ext;
//     const Model = file.exif?.Model ?? "unknown";
//     const DateTimeOriginal = resolveDateTime(file);
//     return {
//         name,
//         fileType,
//         fileHash,
//         isImage,
//         Model,
//         DateTimeOriginal,
//         latitude: 0.01,
//         longitude: 0.01,
//     };
// };

