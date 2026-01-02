import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, AnimatedFAB, useTheme, Text, Card, IconButton, Divider } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageCropPicker from "react-native-image-crop-picker";
import { pick, types } from "@react-native-documents/picker";
import { downloadFile, getFSInfo, DownloadDirectoryPath, exists } from "react-native-fs";
import { ScFile } from "../../../dataType/types/file";
import { uniqBy, cloneDeep } from "lodash";
import { dayjs } from "../../../i18n/i18n";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeSwapPosition } from "../../../store/slice/swapPosition";

import { filesToUrls, fileIcon } from "./constructions";
import { getFileInfo, readImageInfo, imageAddWaterMark } from "../../tools/file";
import { pubParams } from "../../pub/pubParams";
import { requestPermissions } from "../../tools/permission";
import { MarkText } from "../../../dataType/types/scInput";

const allowFileTypes = [types.plainText, types.pdf, types.zip, types.csv, types.doc,
types.docx, types.ppt, types.pptx, types.xls, types.xlsx, "application/rar"];

const fileSource = new Map([
    ["browser", "电脑端选择"],
    ["mobileshoot", "移动端拍照"],
    ["mobilechoose", "移动端选择"],
    ["", "未知"]
]);

interface filePickerProps {
    isOnSitePhoto: boolean;
    isEdit: boolean;
    onOk: (files: ScFile[]) => void;
    onCancel: () => void;
    initFiles: ScFile[];
    markTexts: MarkText[];
}

const FilePicker = ({ isOnSitePhoto, isEdit, onOk, onCancel, initFiles, markTexts }: filePickerProps) => {
    const [files, setFiles] = useState(initFiles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayList, setDisplayList] = useState(true);

    const theme = useTheme();
    const dispatch = useAppDispatch();
    const imageUrls = filesToUrls(files);

    //命令按钮位置
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    //切换命令按钮位置
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    //检查授权
    useEffect(() => {
        const checkPermission = async () => {
            const res = await requestPermissions();
            console.log("checkPermission res:", res);
        }
        checkPermission();
    }, []);

    //文件去重
    const handleRemoveDupFile = (newFiles: ScFile[]) => {
        const fileNumber = newFiles.length; //原有的文件数量
        const removeDupFiles: ScFile[] = uniqBy(newFiles, "hash");
        if (fileNumber > removeDupFiles.length) {
            Alert.alert("提示", `已经去除${fileNumber - removeDupFiles.length}个重复项`);
        }
        setFiles(removeDupFiles);
    };

    //选择文件
    const handlePickFile = async () => {
        try {
            const result = await pick({
                allowMultiSelection: true,
                presentationStyle: "fullScreen",
                copyTo: "cachesDirectory",
                type: allowFileTypes,
            });
            if (result.length === 0) {//如果没有选择文件则直接返回
                return
            }
            //获取所有文件hash值
            let fileArr: ScFile[] = [];
            for (let i = 0; i < result.length; i++) {
                //检查文件大小          
                if ((result[i].size ?? 0 / 1024) > 20480) {
                    Alert.alert(
                        "错误",
                        "单个文件不能大于20M!",
                        [{
                            text: "确定",
                        }]
                    )
                    return
                }
                //获取文件信息
                const fileInfo = await getFileInfo(result[i]);

                let file: ScFile = {
                    id: 0,
                    fileKey: i,
                    originFileName: result[i].name ?? undefined,
                    fileUri: result[i].uri,
                    fileUrl: "",
                    mime: fileInfo.mime,
                    filePath: fileInfo.filePath,
                    fileType: fileInfo.fileType,
                    isImage: fileInfo.isImage ?? 0,
                    model: fileInfo.Model,
                    longitude: fileInfo.longitude,
                    latitude: fileInfo.latitude,
                    hash: fileInfo.fileHash,
                    dateTimeOriginal: fileInfo.DateTimeOriginal,
                    source: "mobilechoose"
                };

                fileArr.push(file);
            }

            fileArr.push(...files);
            handleRemoveDupFile(fileArr);
        } catch (e) {
            console.log("出现错误:", e);
        }
    };
    //选择图片
    const handleChooseImage = async () => {
        let fileArr: ScFile[] = [];
        try {
            const result = await ImageCropPicker.openPicker({
                mediaType: "photo",
                compressImageMaxHeight: 1024,
                compressImageMaxWidth: 1024,
                compressImageQuality: 0.8,
                cropping: false,
                includeExif: true,
            });

            const fileInfo = await readImageInfo(result);
            let file: ScFile = {
                id: 0,
                fileKey: 0,
                originFileName: fileInfo.name,
                fileUrl: fileInfo.filePath,
                fileUri: fileInfo.filePath,
                mime: fileInfo.mime,
                size: result.size,
                filePath: fileInfo.filePath,
                fileType: fileInfo.fileType,
                isImage: fileInfo.isImage ?? 0,
                model: fileInfo.Model,
                longitude: fileInfo.longitude,
                latitude: fileInfo.latitude,
                hash: fileInfo.fileHash,
                dateTimeOriginal: fileInfo.DateTimeOriginal,
                source: "mobilechoose"
            };

            fileArr.push(file);
            fileArr.push(...files);
            //去重
            handleRemoveDupFile(fileArr);
        }
        catch (err) {
            console.log("选择错误", err)
        }
    }
    //拍摄图片
    const handleShotImage = async () => {
        let currentLoacation = { longitude: 0.01, latitude: 0.01 };
        let fileArr = [];
        Geolocation.getCurrentPosition(
            (position) => {
                currentLoacation = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                }
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 2000,
            }
        );
        try {
            const result = await ImageCropPicker.openCamera({
                compressImageMaxHeight: 1024,
                compressImageMaxWidth: 1024,
                compressImageQuality: 0.8,
                cropping: false,
                includeExif: true,
            });

            const fileInfo = await imageAddWaterMark(result, markTexts, currentLoacation);
            let file: ScFile = {
                id: 0,
                fileKey: 0,
                originFileName: fileInfo.name,
                fileUrl: fileInfo.filePath,
                fileUri: fileInfo.filePath,
                mime: fileInfo.mime,
                size: result.size,
                filePath: fileInfo.filePath,
                fileType: fileInfo.fileType,
                isImage: fileInfo.isImage,
                model: fileInfo.Model,
                longitude: currentLoacation.longitude,
                latitude: currentLoacation.latitude,
                hash: fileInfo.fileHash,
                dateTimeOriginal: fileInfo.DateTimeOriginal,
                source: "mobileshoot"
            };
            fileArr.push(file);
            fileArr.push(...files);
            //去重
            handleRemoveDupFile(fileArr);
        }
        catch (err) {
            console.log("拍照错误", err)
        }
    };
    const handleDeleteFile = (index: number) => {
        let newFiles = cloneDeep(files);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };
    //点击文件封面
    const handleOnPressImage = (item: ScFile) => {
        if (item.isImage === 0) {
            return
        }

        let index = imageUrls.findIndex(image => image.hash === item.hash);
        setCurrentIndex(index);
        setDisplayList(false);
    };

    //保存文件到本机
    const handleSaveFile = async (item: ScFile) => {
        const path = `${DownloadDirectoryPath}/${item.originFileName}`;
        const fileExist = await exists(path);
        const resp = downloadFile({
            fromUrl: item.fileUrl,
            toFile: path
        });
        resp.promise
            .then(async res => {
                if (res && res.statusCode === 200 && res.bytesWritten > 0) {
                    await getFSInfo().then(response => {
                        const deviceSpace = response.freeSpace * 0.001;
                        if (deviceSpace > res.bytesWritten) {
                            Alert.alert(
                                "下载完成",
                                `文件保存在:${path}`,
                                [
                                    {
                                        text: "确定"
                                    }
                                ]
                            );
                        } else {
                            Alert.alert('保存失败', "本地存储空间不足,无法保存!", [{
                                text: "确定"
                            }]);
                        }
                    });
                } else {
                    Alert.alert("下载失败", "未知错误", [{ text: "确定" }]);
                }
            })
            .catch(err => {
                if (fileExist) {
                    Alert.alert(
                        '提示',
                        `文件已经存在,请删除或重命名"${path}"后再下载!`,
                        [{
                            text: "确定",
                            onPress: () => { return }
                        }]);
                } else {
                    Alert.alert("下载失败", `出现错误:${err}`, [{ text: "确定" }]);
                }
            })
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            {displayList
                ? <>
                    <ScrollView style={{ flex: 1 }}>
                        {files.map((file, index) => {
                            const fileUri = file.isImage === 1 ? file.fileUrl : fileIcon;
                            return <Card style={{ margin: 8 }} key={index}>
                                <TouchableOpacity onPress={() => handleOnPressImage(file)}>
                                    <Card.Cover source={{ uri: fileUri }} resizeMode={file.isImage === 0 ? "contain" : "cover"} />
                                </TouchableOpacity>
                                <Card.Title title={file.originFileName} titleMaxFontSizeMultiplier={1.5} />
                                <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    <Text style={{ width: "100%" }} maxFontSizeMultiplier={1.5}>创建时间:  {dayjs(file.dateTimeOriginal).format("YYYY-MM-DD HH:mm")}</Text>
                                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }} maxFontSizeMultiplier={1.5}>经度: {file.longitude}</Text>
                                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }} maxFontSizeMultiplier={1.5}>纬度: {file.latitude}</Text>
                                    <Text style={{ width: "100%", overflow: "hidden" }} maxFontSizeMultiplier={1.5}>来源:{fileSource.get(file.source)}</Text>
                                </Card.Content>
                                <Divider style={{ margin: 4 }} />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    {isEdit
                                        ? <Button mode="text" textColor="red" onPress={() => handleDeleteFile(index)}>删除</Button>
                                        : null
                                    }
                                    <Button mode="text" disabled={file.id === 0} onPress={() => handleSaveFile(file)}>下载</Button>
                                </View>
                            </Card>
                        })}
                    </ScrollView>
                    {isEdit
                        ? <>
                            {isOnSitePhoto
                                ? null
                                : <>
                                    <AnimatedFAB
                                        icon="paperclip"
                                        label="选择文件"
                                        extended={false}
                                        visible={true}
                                        onPress={handlePickFile}
                                        animateFrom={buttonPosition}
                                        style={{ bottom: 336, position: "absolute", ...orderPosition }}
                                    />
                                    <AnimatedFAB
                                        icon="image"
                                        label="选择图片"
                                        extended={false}
                                        visible={true}
                                        onPress={handleChooseImage}
                                        animateFrom={buttonPosition}
                                        style={{ bottom: 272, position: "absolute", ...orderPosition }}
                                    />
                                </>
                            }
                            <AnimatedFAB
                                icon="camera-outline"
                                label="拍摄图片"
                                extended={false}
                                visible={true}
                                onPress={handleShotImage}
                                animateFrom={buttonPosition}
                                style={{ bottom: 208, position: "absolute", ...orderPosition }}
                            />
                            <AnimatedFAB
                                icon="check"
                                label="确定"
                                extended={false}
                                visible={true}
                                onPress={() => onOk(files)}
                                animateFrom={buttonPosition}
                                style={{ bottom: 144, position: "absolute", ...orderPosition }}
                            />
                        </>
                        : null
                    }
                    <AnimatedFAB
                        icon="keyboard-return"
                        label="返回"
                        extended={false}
                        visible={true}
                        onPress={onCancel}
                        animateFrom={buttonPosition}
                        style={{ bottom: 64, position: "absolute", ...orderPosition }}
                    />
                    <IconButton
                        icon="swap-horizontal"
                        iconColor={theme.colors.primary}
                        onPress={handleSwapPosition}
                        style={{ bottom: 160, position: "absolute", ...swapPosition }}
                    />
                </>
                : <ImageViewer
                    imageUrls={imageUrls}
                    onClick={() => setDisplayList(true)}
                    menuContext={{ saveToLocal: "保存到相册", cancel: "取消" }}
                    index={currentIndex}
                    saveToLocalByLongPress={false}
                    onSave={() => { }}
                    enablePreload={false}
                />
            }


        </SafeAreaView>
    );
};

export default FilePicker;