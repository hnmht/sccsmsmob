import jsSHA from "jssha";
import { dayjs } from "../../i18n/i18n";
import RNFS from "react-native-fs";
import { decode } from "base64-arraybuffer";
import RNPhotoManipulator from "react-native-photo-manipulator";
import { Image } from "react-native-image-crop-picker";


/* 
//图片水印文本字体
export const markFontOptions = { fontSize: 16, textColor: "#FFFAFA", marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20, rowHeight: 20 };

export const getFileInfo = async (file: RNFS.ReadDirItem) => {
    let name = file.name; //获取文件名
    let fileType = name.substring(name.lastIndexOf("."), name.length); //获取文件类型
    //解决中文文件名无法读取问题
    const pos = file.fileCopyUri.lastIndexOf("/");
    const filePath = file.fileCopyUri.substr(0, pos) + "/" + name;
    //使用RNFS 耗时46毫秒
    const fileHash = await RNFS.hash(filePath, "sha256");

    //设定文件属性的默认值
    let isImage = 0; //是否图片
    let Model = "n"; //相机型号,默认为"none"
    let DateTimeOriginal = dayjs().format("YYYYMMDDHHmm"); //最近更新日期
    let latitude = 0.01;  //纬度
    let longitude = 0.01;//经度
    let mime = file.type;

    return {
        name,
        mime,
        fileType,
        filePath,
        fileHash,
        isImage,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
    };
};

//获取拍照文件信息
export const getShotImageInfo = async (file, markTexts, currentLocation) => {
    let filePath = file.path;
    let name = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length); //获取文件名
    let fileType = name.substring(name.lastIndexOf("."), name.length); //获取文件类型
    const fileHash = await RNFS.hash(filePath, "sha256"); //计算文件hash
    let isImage = 1; //是否图片
    let Model = "n"; //相机型号,默认为"none"
    let DateTimeOriginal = dayjs().format("YYYYMMDDHHmm"); //最近更新日期
    let longitude = 0.01;
    let latitude = 0.01;
    let mime = file.mime;

    let markImagePath = filePath;
    //增加水印
    const thisMark = [];
    //将markTexts加入图片左上方
    markTexts.forEach((item, index) => {
        thisMark.push({
            position: { x: markFontOptions.marginLeft, y: markFontOptions.marginTop + markFontOptions.rowHeight * index },
            text: item.text,
            textSize: markFontOptions.fontSize,
            color: markFontOptions.textColor
        })
    })

    const imageInfoTexts = [];
    let height = 0;
    let width = 0;
    if (file.height && file.width) {
        height = file.height;
        width = file.width;
        //添加经度
        imageInfoTexts.push({ position: { x: 0, y: 0 }, text: `经度:${currentLocation.longitude}`, textSize: 20, color: " rgb(92, 93, 114)" });
        //添加纬度
        imageInfoTexts.push({ position: { x: 0, y: 0 }, text: `纬度:${currentLocation.latitude}`, textSize: 20, color: " rgb(92, 93, 114)" });
        //创建时间及来源
        imageInfoTexts.push({ position: { x: 0, y: 0 }, text: `${dayjs().format("YY-MM-DD HH:mm")} | 现场拍照`, textSize: 20, color: " rgb(92, 93, 114)" });
        // //来源
        // imageInfoTexts.push({ position: { x: 0, y: 0 }, text: `来源:移动端拍照`, textSize: 20, color: " rgb(92, 93, 114)" });

        // let maxLength = 0;
        // //计算最长文本
        // imageInfoTexts.forEach(item => {
        //     if (item.text.length > maxLength) {
        //         maxLength = item.text.length;
        //     }
        // });

        //计算右下角显示第一行y值
        let y = height - (imageInfoTexts.length * markFontOptions.rowHeight + markFontOptions.marginBottom);
        let x = width - 12 * markFontOptions.fontSize - markFontOptions.marginRight;

        imageInfoTexts.forEach((item, index) => {
            thisMark.push({
                position: { x: x, y: y + index * markFontOptions.rowHeight },
                text: item.text,
                textSize: markFontOptions.fontSize,
                color: markFontOptions.textColor
            })
        });
        //  console.log("hash thisMark:", thisMark);
        markImagePath = await RNPhotoManipulator.printText(filePath, thisMark);
    }

    if (file.exif) {
        if (file.exif.Model) { Model = file.exif.Model };
        if (file.exif.DateTimeDigitized) { DateTimeOriginal = dayjs(file.exif.DateTimeDigitized, "YYYY:MM:DD HH:mm:ss").format("YYYYMMDDHHmm") };
        if (file.exif.Latitude) { latitude = file.exif.latitude };
        if (file.exif.Longtitude) { longitude = file.Longtitude };
    }

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

//获取选择照片信息
export const getChooseImageInfo = async (file) => {
    let filePath = file.path;
    let name = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length); //获取文件名
    let fileType = name.substring(name.lastIndexOf("."), name.length); //获取文件类型
    const fileHash = await RNFS.hash(filePath, "sha256"); //计算文件hash
    let isImage = 1; //是否图片
    let Model = "n"; //相机型号,默认为"none"
    let DateTimeOriginal = dayjs().format("YYYYMMDDHHmm"); //最近更新日期
    let latitude = 0.01;  //纬度
    let longitude = 0.01;//经度
    let mime = file.mime;


    if (file.exif) {
        if (file.exif.Model) { Model = file.exif.Model };
        if (file.exif.DateTimeDigitized) { DateTimeOriginal = dayjs(file.exif.DateTimeDigitized, "YYYY:MM:DD HH:mm:ss").format("YYYYMMDDHHmm") };
        if (file.exif.Latitude) { latitude = file.exif.Latitude };
        if (file.exif.Longitude) { longitude = file.exif.Longitude };
    }
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
}; */

//获取CropImage文件信息
export const getCropImageInfo = async (file: Image) => {
    let path = file.path;
    let name = path.substring(path.lastIndexOf("/") + 1, path.length); //获取文件名
    let fileType = name.substring(name.lastIndexOf("."), name.length); //获取文件类型

    const content = await RNFS.readFile(file.path, "base64");
    const arrayBuffer = decode(content);

    const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
    shaObj.update(arrayBuffer);
    const fileHash = shaObj.getHash("HEX");

    //设定文件属性的默认值
    let isImage = 0; //是否图片
    let Model = "n"; //相机型号,默认为"none"
    let DateTimeOriginal = dayjs(file.modificationDate).format("YYYYMMDDHHmm"); //最近更新日期

    let latitude = 0.01;  //纬度
    let longitude = 0.01;//经度
    //检查文件类型
    const uint8Array = new Uint8Array(arrayBuffer);
    const checkRes = checkIsImage(uint8Array);

    if (checkRes.isImage) { //如果是图片
        isImage = checkRes.isImage ? 1 : 0;
        fileType = checkRes.type //更新真实的文件类型      

        //如果正确获取了图片的exif信息则修改默认值
        if (file.exif) {
            if (file.exif.Model) { Model = file.exif.Model };
            if (file.exif.DateTimeDigitized) { DateTimeOriginal = dayjs(file.exif.DateTimeDigitized, "YYYY:MM:DD HH:mm:ss").format("YYYYMMDDHHmm") };
        }
    }

    return {
        name,
        fileType,
        fileHash,
        isImage,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
    };
};


export type ImageCheckResult =
    | { isImage: true; type: 'gif' | 'jpg' | 'png' }
    | { isImage: false; type: 'none' }

const MAGIC = {
    png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    jpegStart: [0xff, 0xd8, 0xff],
    jpegJFIF: [0x4a, 0x46, 0x49, 0x46], // JFIF
    jpegEXIF: [0x45, 0x78, 0x69, 0x66], // Exif
    gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
} as const;

function matchBytes(
    buf: Uint8Array,
    offset: number,
    magic: readonly number[]
): boolean {
    if (buf.length < offset + magic.length) return false

    for (let i = 0; i < magic.length; i++) {
        if (buf[offset + i] !== magic[i]) {
            return false
        }
    }
    return true
}


export function checkIsImage(buf: Uint8Array | ArrayBuffer | null): ImageCheckResult {
    if (!buf) {
        return { isImage: false, type: 'none' }
    }

    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)

    if (bytes.length < 8) {
        return { isImage: false, type: 'none' }
    }

    // GIF: bytes 0–5
    if (
        matchBytes(bytes, 0, MAGIC.gif87a) ||
        matchBytes(bytes, 0, MAGIC.gif89a)
    ) {
        return { isImage: true, type: 'gif' }
    }

    // JPEG: FF D8 FF at start, JFIF / Exif at offset 6
    if (
        matchBytes(bytes, 0, MAGIC.jpegStart) &&
        (matchBytes(bytes, 6, MAGIC.jpegJFIF) ||
            matchBytes(bytes, 6, MAGIC.jpegEXIF))
    ) {
        return { isImage: true, type: 'jpg' }
    }

    // PNG: bytes 0–7
    if (matchBytes(bytes, 0, MAGIC.png)) {
        return { isImage: true, type: 'png' }
    }

    return { isImage: false, type: 'none' }
}


