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

// Get File name and file type
function parseFileName(path: string) {
    const name = path.split("/").pop() ?? "unknown"
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : ""
    return { name, ext }
}

// Read File Header
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

export const getFileInfo = async (file: DocumentPickerResponse) => {
    const filePath = file.uri;
    const { name, ext } = parseFileName(filePath);
    //解决中文文件名无法读取问题
    // const pos = file.fileCopyUri.lastIndexOf("/");
    // const filePath = file.fileCopyUri.substr(0, pos) + "/" + name;
    const fileHash = await RNFS.hash(filePath, "sha256");
    return {
        name,
        mime: ext,
        fileType: ext,
        filePath,
        fileHash,
        isImage: 0,
        Model: "unknown",
        DateTimeOriginal: dayjs().format("YYYYMMDDHHmm"),
        latitude: 0.01,
        longitude: 0.01,
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
export const imageAddWaterMark = async (file: Image, markTexts: MarkText[], currentLocation: Location) => {
    const imageInfo = await readImageInfo(file);
    const { name,
        fileType,
        mime,
        filePath,
        fileHash,
        isImage,
        Model,
        DateTimeOriginal,
        latitude,
        longitude } = imageInfo;
    // 没尺寸直接返回
    if (!file.width || !file.height) {
        return { ...imageInfo, filePath };
    }
    const marks: MarkText[] = [];
    /** 左上角：业务水印 */
    marks.push(
        ...buildTextBlock(
            markTexts.map(t => t.text),
            markFontOptions.margin.left,
            markFontOptions.margin.top
        )
    );
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

    return {
        name,
        fileType,
        filePath: markImagePath,
        fileHash,
        isImage,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
        mime
    };
};

// Get Image info
export const readImageInfo = async (file: Image) => {
    const filePath = file.path;
    const { name, ext } = parseFileName(filePath);
    const header = await readFileHeader(filePath, 64);
    const typeInfo = checkIsImage(header);
    const fileHash = await RNFS.hash(file.path, "sha256");
    const isImage = typeInfo.isImage ? 1 : 0;
    const fileType = typeInfo.isImage ? typeInfo.type : ext;
    const Model = file.exif?.Model ?? "unknown";
    const DateTimeOriginal = resolveDateTime(file);
    const { latitude, longitude } = resolveLocation(file);
    const mime = file.mime;
    return {
        name,
        fileType,
        mime,
        filePath,
        fileHash,
        isImage,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
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

