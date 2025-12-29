import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, PermissionsAndroid, Platform, Alert } from "react-native";
import { Button, AnimatedFAB, useTheme, Text, Card, IconButton, Divider } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageCropPicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { downloadFile, getFSInfo, DownloadDirectoryPath, exists } from "react-native-fs";
// import dayjs from "dayjs";
import dayjs from "../../../utils/myDayjs";
import { useDispatch, useSelector } from "react-redux";
import { changeSwapPosition } from "../../../store/slice/swapPosition";
import { DeepCloneJSON, RemoveDupObjectArr } from "../../../utils/tools";
import { filesToUrls, fileIcon } from "./constructor";
import { getFileInfo, getShotImageInfo, getChooseImageInfo } from "../../../utils/hash";
import { pubParams } from "../../pub/pubParms";

const allowFileTypes = [DocumentPicker.types.plainText, DocumentPicker.types.pdf, DocumentPicker.types.zip, DocumentPicker.types.csv, DocumentPicker.types.doc,
DocumentPicker.types.docx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, DocumentPicker.types.xls, DocumentPicker.types.xlsx, "application/rar"];

const fileSource = new Map([
    ["browser", "电脑端选择"],
    ["mobileshoot", "移动端拍照"],
    ["mobilechoose", "移动端选择"],
    ["", "未知"]
]);

const FilePicker = ({ isOnSitePhoto, isEdit, onOk, onCancel, initFiles, markTexts }) => {
    const [files, setFiles] = useState(initFiles);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayList, setDisplayList] = useState(true);

    const theme = useTheme();
    const dispatch = useDispatch();
    const imageUrls = filesToUrls(files);

    //命令按钮位置
    const { buttonPosition, swapPosition, orderPosition } = useSelector(state => state.swapposition);
    //切换命令按钮位置
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    //检查授权
    useEffect(() => {
        const checkPermisson = async () => {
            //检查授权结果
            const checkRes = (permissionsRes) => {
                let denyNumber = 0;
                for (let key in permissionsRes) {
                    if (permissionsRes[key] !== "granted") {
                        denyNumber++
                    }
                };
                if (denyNumber > 0) {
                    onCancel();
                }
            };
            /*  //创建下载文件夹
             const createFolder = () => {
                 const floderPath = `${DownloadDirectoryPath}/scenemob`;
 
             }; */
            //安卓33以下版本申请授权
            const applyAdnroid33Below = async () => {
                const reqPermissons = await PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    ]
                );
                checkRes(reqPermissons);
            };
            //安卓33及以上版本申请授权
            const applyAndroid33Above = async () => {
                const reqPermissons = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                ]);
                checkRes(reqPermissons);
            };
            //如果在web端运行直接退出
            if (Platform.OS === "web") {
                return
            }
            try {
                if (Platform.OS === "android") {
                    const cameraGranted = await PermissionsAndroid.check('android.permission.CAMERA');
                    const locationGranted = await PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION");
                    const mediaLocationGranted = await PermissionsAndroid.check("android.permission.ACCESS_MEDIA_LOCATION");
                    const readMediaGranted = await PermissionsAndroid.check("android.permission.READ_MEDIA_IMAGES");
                    const readStorageGranted = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE");
                    const writeStorageGranted = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE");

                    if (Platform.Version >= 33) {
                        if (!cameraGranted || !locationGranted || !readMediaGranted || !mediaLocationGranted) {
                            Alert.alert(
                                "申请权限",
                                `1.为了使用相机拍摄附件,需申请摄像头权限;2.为记录照片类附件拍摄时的地理位置,需申请位置信息权限;3.为将附件临时存入本机,需申请手机存储写入权限;4.为从本机选择附件,需申请手机存储读取权限`,
                                [
                                    {
                                        text: "拒绝",
                                        onPress: () => onCancel(),
                                        style: "cancel"
                                    },
                                    {
                                        text: "同意",
                                        onPress: () => applyAndroid33Above(),
                                    }
                                ],
                            );
                        }
                    } else {
                        if (!cameraGranted || !locationGranted || !readStorageGranted || !writeStorageGranted) {
                            Alert.alert(
                                "申请存储权限",
                                `1.为了使用相机拍摄附件,需申请相机权限;2.为记录照片类附件拍摄时的地理位置,需申请定位权限;3.为将附件临时存入本机,需申请手机存储写入权限;4.为从本机选择附件,需申请手机存储读取权限`,
                                [
                                    {
                                        text: "拒绝",
                                        onPress: () => onCancel(),
                                        style: "cancel"
                                    },
                                    {
                                        text: "同意",
                                        onPress: () => applyAdnroid33Below(),
                                    }
                                ],
                            );
                        }
                    }
                }
            } catch (err) {
                onCancel();
            }
        };
        checkPermisson();
    }, []);

    //文件去重
    const handleRemoveDupFile = (newFiles) => {
        const fileNumber = newFiles.length; //原有的文件数量
        const removeDupFiles = RemoveDupObjectArr(newFiles, "filehash");
        if (fileNumber > removeDupFiles.length) {
            Alert.alert("提示", `已经去除${fileNumber - removeDupFiles.length}个重复项`);
        }
        setFiles(removeDupFiles);
    };

    //选择文件
    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                allowMultiSelection: true,
                presentationStyle: "fullScreen",
                copyTo: "cachesDirectory",
                type: allowFileTypes,
            });
            if (result.length === 0) {//如果没有选择文件则直接返回
                return
            }
            //获取所有文件hash值
            let fileArr = [];
            for (let i = 0; i < result.length; i++) {
                //检查文件大小
                if ((result[i].size / 1024) > 20480) {
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

                let file = {
                    fileid: 0,
                    filekey: i,
                    originfilename: result[i].name,
                    fileuri: result[i].uri,
                    fileurl: "",
                    mime: fileInfo.mime,
                    filepath: fileInfo.filePath,
                    filetype: fileInfo.fileType,
                    isimage: fileInfo.isImage,
                    model: fileInfo.Model,
                    longitude: fileInfo.longitude,
                    latitude: fileInfo.latitude,
                    filehash: fileInfo.fileHash,
                    datetimeoriginal: fileInfo.DateTimeOriginal,
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
        let fileArr = [];
        try {
            const result = await ImageCropPicker.openPicker({
                mediaType: "photo",
                compressImageMaxHeight: 1024,
                compressImageMaxWidth: 1024,
                compressImageQuality: 0.8,
                cropping: false,
                includeExif: true,
            });

            const fileInfo = await getChooseImageInfo(result);
            let file = {
                fileid: 0,
                filekey: 0,
                originfilename: fileInfo.name,
                fileurl: fileInfo.filePath,
                fileuri: fileInfo.filePath,
                mime: fileInfo.mime,
                size: result.size,
                filepath: fileInfo.filePath,
                filetype: fileInfo.fileType,
                isimage: fileInfo.isImage,
                model: fileInfo.Model,
                longitude: fileInfo.longitude,
                latitude: fileInfo.latitude,
                filehash: fileInfo.fileHash,
                datetimeoriginal: fileInfo.DateTimeOriginal,
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

            const fileInfo = await getShotImageInfo(result, markTexts, currentLoacation);
            let file = {
                fileid: 0,
                filekey: 0,
                originfilename: fileInfo.name,
                fileurl: fileInfo.filePath,
                fileuri: fileInfo.filePath,
                mime: fileInfo.mime,
                size: result.size,
                filepath: fileInfo.filePath,
                filetype: fileInfo.fileType,
                isimage: fileInfo.isImage,
                model: fileInfo.Model,
                longitude: currentLoacation.longitude,
                latitude: currentLoacation.latitude,
                filehash: fileInfo.fileHash,
                datetimeoriginal: fileInfo.DateTimeOriginal,
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
    const handleDeleteFile = (index) => {
        let newFiles = DeepCloneJSON(files);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };
    //点击文件封面
    const handleOnPressImage = (item) => {
        if (item.isimage === 0) {
            return
        }

        let index = imageUrls.findIndex(image => image.filehash === item.filehash);
        setCurrentIndex(index);
        setDisplayList(false);
    };

    //保存文件到本机
    const handleSaveFile = async (item) => {
        const path = `${DownloadDirectoryPath}/${item.originfilename}`;
        const fileExist = await exists(path);
        const resp = downloadFile({
            fromUrl: item.fileurl,
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
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            {displayList
                ? <>
                    <ScrollView style={{ flex: 1 }}>
                        {files.map((file, index) => {
                            const fileUri = file.isimage === 1 ? file.fileurl : fileIcon;
                            return <Card style={{ margin: 8 }} key={index}>
                                <TouchableOpacity onPress={() => handleOnPressImage(file)}>
                                    <Card.Cover source={{ uri: fileUri }} resizeMode={file.isimage === 0 ? "contain" : "cover"} />
                                </TouchableOpacity>
                                <Card.Title title={file.originfilename} titleMaxFontSizeMultiplier={1.5} />
                                <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    <Text style={{ width: "100%" }} maxFontSizeMultiplier={1.5}>创建时间:  {dayjs(file.datetimeoriginal).format("YYYY-MM-DD HH:mm")}</Text>
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
                                    <Button mode="text" disabled={file.fileid === 0} onPress={() => handleSaveFile(file)}>下载</Button>
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
                        label="切换"
                        visible={true}
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


        </View>
    );
};

export default FilePicker;