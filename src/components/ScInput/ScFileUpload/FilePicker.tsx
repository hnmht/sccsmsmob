import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Button, AnimatedFAB, useTheme, Text, Card, IconButton, Divider } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageCropPicker from "react-native-image-crop-picker";
import { pick, types, keepLocalCopy, FileToCopy } from "@react-native-documents/picker";
import { downloadFile, getFSInfo, DownloadDirectoryPath, exists, hash } from "react-native-fs";
import { ScFile } from "../../../dataType/types/file";
import { uniqBy, cloneDeep } from "lodash";

import { DateTimeFormat, dayjs } from "../../../i18n/dayjs";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeSwapPosition } from "../../../store/slice/swapPosition";

import { fileMaxSize } from "../../../../app.json";

import { filesToUrls, fileIcon } from "./constructions";
import { readImageInfo, imageAddWaterMark, parseFileName } from "../../tools/file";
import { pubParams } from "../../pub/pubParams";
import { requestPermissions } from "../../tools/permission";
import { MarkText } from "../../../dataType/types/scInput";
import { useTranslation } from "react-i18next";

const allowFileTypes = [types.plainText, types.pdf, types.zip, types.csv, types.doc,
types.docx, types.ppt, types.pptx, types.xls, types.xlsx, "application/rar"];

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
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const imageUrls = filesToUrls(files);

    // Button Position
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    // Actions after 
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    // Check Permissions
    useEffect(() => {
        const checkPermission = async () => {
            const res = await requestPermissions();
            if (!res) {
                Alert.alert(
                    t("error"),
                    t("insufficientPermission"),
                    [
                        {
                            text: t("ok"),
                            onPress: onCancel
                        }
                    ]
                )
            }
        }
        checkPermission();
    }, []);

    // Remove Duplicate files
    const handleRemoveDupFile = (newFiles: ScFile[]) => {
        const fileNumber = newFiles.length;
        const removeDupFiles: ScFile[] = uniqBy(newFiles, "hash");
        if (fileNumber > removeDupFiles.length) {
            Alert.alert(t("tip"), t("duplicateFileRemoved", { count: fileNumber - removeDupFiles.length }));
        }
        setFiles(removeDupFiles);
    };

    // Actions after tapping "Select File" Icon
    const handlePickFile = async () => {
        try {
            const results = await pick({
                allowMultiSelection: true,
                presentationStyle: "fullScreen",
                type: allowFileTypes,
            });
            if (results.length === 0) {
                return
            }
            const copyResults = await keepLocalCopy({
                destination: 'documentDirectory',
                files: results.map((f) => ({
                    uri: f.uri,
                    fileName: f.name ?? `file-${Date.now()}`,
                })) as [FileToCopy, ...FileToCopy[]],
            });


            // Calculate files hash
            let fileArr: ScFile[] = [];
            for (let i = 0; i < copyResults.length; i++) {
                const copy = copyResults[i];
                const original = results[i];
                if (copy.status !== 'success') {
                    console.warn('Copy failed:', copy.sourceUri, copy.copyError);
                    continue;
                }
                const fileSizeKb = Math.round((original.size ?? 0) / 1024);
                // Validate file size       
                if (fileSizeKb > fileMaxSize) {
                    Alert.alert(
                        t("error"),
                        t("singleFileExceed", { fileName: original.name, size: Math.round(fileSizeKb / 1024) }),
                        [{
                            text: t("ok"),
                        }]
                    )
                    return
                }
                const { originFileName, ext } = parseFileName(original.name);

                // Fix issues with reading Chinese filenames
                const decodedUri = decodeURI(copy.localUri);
                const path = decodedUri.replace('file://', '');
                const fileHash = await hash(path, 'sha256');
                const newFile: ScFile = {
                    id: 0,
                    originFileName: originFileName,
                    mime: ext,
                    fileType: ext,
                    filePath: path,
                    fileUrl: copy.localUri,
                    fileUri: original.uri,
                    hash: fileHash,
                    isImage: 0,
                    dateTimeOriginal: dayjs().format("YYYYMMDDHHmm"),
                    latitude: 0.01,
                    longitude: 0.01,
                    source: "mobileUpload",
                    dr: 0
                };
                fileArr.push(newFile);
            }
            fileArr.push(...files);
            // Remove Duplicate files
            handleRemoveDupFile(fileArr);
        } catch (e) {
            console.log(t("error"), e);
        }
    };
    // Actions after tapping "Select Image" button
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
            fileInfo.source = "mobileUpload";
            fileArr.push(fileInfo);
            fileArr.push(...files);
            // Remove Duplicate files
            handleRemoveDupFile(fileArr);
        }
        catch (err) {
            console.log(t("error"), err)
        }
    }
    // Actions after tapping "Shoting Picture" button
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
                console.error(error);
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
            fileInfo.source = "mobileShoot";
            fileArr.push(fileInfo);
            fileArr.push(...files);
            // Remove duplicate files
            handleRemoveDupFile(fileArr);
        }
        catch (err) {
            console.error(t("error"), err)
        }
    };
    // Actions after tapping "Delete" button
    const handleDeleteFile = (index: number) => {
        let newFiles = cloneDeep(files);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };
    // Actions after tapping Image item
    const handleOnPressImage = (item: ScFile) => {
        if (item.isImage === 0) {
            return
        }

        let index = imageUrls.findIndex(image => image.hash === item.hash);
        setCurrentIndex(index);
        setDisplayList(false);
    };

    // Save file to local devices
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
                                t("tip"),
                                t("fileDownloadComplete", { path: path }),
                                [
                                    {
                                        text: t("ok")
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(t("error"), t("fileDownloadFailedSpace"), [{
                                text: t("ok")
                            }]);
                        }
                    });
                } else {
                    Alert.alert(t("error"), t("fileDownloadFailedUnknown"), [{ text: t("ok") }]);
                }
            })
            .catch(err => {
                if (fileExist) {
                    Alert.alert(
                        t("tip"),
                        t("fileDownloadFailedExist", { path: path }),
                        [{
                            text: t("ok"),
                            onPress: () => { return }
                        }]);
                } else {
                    Alert.alert(t("error"), t("fileDownloadFailedError", { errMsg: err }), [{ text: t("ok") }]);
                }
            })
    };

    return (<View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        {displayList
            ? <ScrollView style={{ flex: 1 }}>
                {files.map((file, index) => {
                    const fileUrl = file.isImage === 1 ? file.fileUrl : fileIcon;
                    const dateTimeOriginal = file.dateTimeOriginal ? dayjs(file.dateTimeOriginal, "YYYYMMDDHHmm") : dayjs(new Date());
                    return <Card style={{ margin: 8 }} key={index}>
                        <TouchableOpacity onPress={() => handleOnPressImage(file)}>
                            <Card.Cover source={{ uri: fileUrl }} resizeMode={file.isImage === 0 ? "contain" : "cover"} />
                        </TouchableOpacity>
                        <Card.Title title={file.originFileName} titleMaxFontSizeMultiplier={1.5} />
                        <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            <Text style={{ width: "100%" }} maxFontSizeMultiplier={1.5}>{t("createDate")}:  {DateTimeFormat(dateTimeOriginal, "LLL")}</Text>
                            <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }} maxFontSizeMultiplier={1.5}>{t("longitude")}: {file.longitude}</Text>
                            <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }} maxFontSizeMultiplier={1.5}>{t("latitude")}: {file.latitude}</Text>
                            <Text style={{ width: "100%", overflow: "hidden" }} maxFontSizeMultiplier={1.5}>{t("sourceType")}: {t(file.source)}</Text>
                        </Card.Content>
                        <Divider style={{ margin: 4 }} />
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            {isEdit
                                ? <Button mode="text" textColor="red" onPress={() => handleDeleteFile(index)}>{t("delete")}</Button>
                                : null
                            }
                            <Button mode="text" disabled={file.id === 0} onPress={() => handleSaveFile(file)}>{t("download")}</Button>
                        </View>
                    </Card>
                })}
            </ScrollView>
            : <ImageViewer
                imageUrls={imageUrls}
                onClick={() => setDisplayList(true)}
                menuContext={{ saveToLocal: t("saveToPhotos"), cancel: t("cancel") }}
                index={currentIndex}
                saveToLocalByLongPress={false}
                onSave={() => { }}
                enablePreload={false}
            />
        }
        {isEdit
            ? <>
                {isOnSitePhoto
                    ? null
                    : <>
                        <AnimatedFAB
                            icon="paperclip"
                            label={t("selectFile")}
                            extended={false}
                            visible={true}
                            onPress={handlePickFile}
                            animateFrom={buttonPosition}
                            style={{ bottom: 336, position: "absolute", ...orderPosition }}
                        />
                        <AnimatedFAB
                            icon="image"
                            label={t("choosePhoto")}
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
                    label={t("takePhoto")}
                    extended={false}
                    visible={true}
                    onPress={handleShotImage}
                    animateFrom={buttonPosition}
                    style={{ bottom: 208, position: "absolute", ...orderPosition }}
                />
                <AnimatedFAB
                    icon="check"
                    label={t("ok")}
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
            label={t("back")}
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
    </View>
    );
};

export default FilePicker;

