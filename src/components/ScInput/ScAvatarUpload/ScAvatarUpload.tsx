import { useState, memo, useEffect } from "react";
import { View, Alert, Platform, PermissionsAndroid, PermissionStatus } from "react-native";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper";
import ImageCropPicker, { Image } from "react-native-image-crop-picker";
import { checkMultiple, PERMISSIONS } from "react-native-permissions";

import { reqGetFileByHash, reqUploadFiles } from "../../../api/file";
import { getCropImageInfo } from "../../tools/file";
import { File } from "../../../dataType/types/file";

interface ScAvatarUploadProps {
    fieldIndex?: number;
    rowIndex?: number;
    isEdit: boolean;
    itemKey: string;
    initValue: File;
    pickDone: Function;
    width?: number;
    onCancel: Function;
}

//901
const ScAvatarUpload = ({
    fieldIndex,
    rowIndex,
    isEdit,
    itemKey,
    initValue,
    pickDone,
    width,
    onCancel = () => { }
}: ScAvatarUploadProps) => {
    const [avatar, setAvatar] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    //检查授权
    useEffect(() => {
        const checkPermission = async () => {
            const res = await checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.PHOTO_LIBRARY]);
            console.log("checkPermission res:", res);
        }
        checkPermission();
    }, []);
    //选中文件后执行的操作
    const handleFileSelect = async (file: Image) => {
        setIsLoading(true);

        if ((file.size / 1024) > 5120) {
            setIsLoading(false);
            return
        }
        let formData = new FormData(); //准备formData
        //获取文件信息值
        let fileInfo = await getCropImageInfo(file);

        if (fileInfo.isImage === 0) {

            setIsLoading(false);
            return
        }
        const scFile: File = {
            id: 0,
            fileKey: 0,
            originFileName: fileInfo.name,
            fileType: fileInfo.fileType,
            isImage: fileInfo.isImage,
            model: fileInfo.Model,
            longitude: fileInfo.longitude,
            latitude: fileInfo.latitude,
            hash: fileInfo.fileHash,
            dateTimeOriginal: fileInfo.DateTimeOriginal,
            fileUrl: ""
        }
        const getFilesHashRes = await reqGetFileByHash(scFile, false);
        //检查服务器返回错误情况
        if (!getFilesHashRes.status) {
            Alert.alert("错误", getFilesHashRes.msg);
            setIsLoading(false);
            return
        }
        let newAvatar: File = { id: 0, fileUrl: "" };
        //如果文件不存在，则需要上传文件
        if (getFilesHashRes.data && getFilesHashRes.data.id === 0) {
            let uploadFile = { uri: file.path, type: file.mime, name: fileInfo.name };
            formData.append("files", uploadFile);
            formData.append("filekey", 0);
            formData.append("filehash", fileInfo.fileHash);
            formData.append("filename", fileInfo.name);
            formData.append("filetype", fileInfo.fileType);
            formData.append("isimage", fileInfo.isImage);
            formData.append("model", fileInfo.Model); //相机型号
            formData.append("DateTimeOriginal", fileInfo.DateTimeOriginal); //初始拍摄时间
            formData.append("latitude", fileInfo.latitude);//纬度
            formData.append("longitude", fileInfo.longitude);//经度 
            formData.append("source", "mobilechoose");
            //向服务器上传文件
            const uploadRes = await reqUploadFiles(formData, false);

            if (uploadRes.status) {
                Alert.alert("错误", uploadRes.msg);
                setIsLoading(false);
                return
            }
            newAvatar = uploadRes.data[0];
        } else {
            newAvatar = getFilesHashRes.data;
        }

        setAvatar(newAvatar);
        setIsLoading(false);
        //将值反馈给父组件
        let err = { isErr: false, msg: "" };
        pickDone(newAvatar, itemKey, fieldIndex, rowIndex, err);
    };

    //选择图片
    const handlePickImage = async () => {
        console.log("开始选择图片")
        ImageCropPicker.openPicker({
            width: 256,
            height: 256,
            cropping: true,
            includeExif: true,
            mediaType: "photo"
        }).then(image => {
            handleFileSelect(image);
        }).catch(err => {
            console.log("选择错误", err)
        })

    };

    return (
        <View style={{ flexDirection: "row", justifyContent: "center", width: width, padding: 8 }}>
            <View style={{
                position: 'relative',
                overflow: 'hidden'
            }}>
                {avatar.fileUrl === ""
                    ? <Avatar.Icon icon="camera" size={90} />
                    : <Avatar.Image source={{ uri: avatar.fileUrl }} size={96} />
                }
                {isEdit
                    ? <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,.65)',
                        width: '100%',
                        height: '100%',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 48
                    }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <IconButton icon="camera" disabled={isLoading} iconColor={theme.colors.primary} size={32} onPress={handlePickImage} />
                            <Text>上传</Text>
                        </View>
                    </View>
                    : null
                }
            </View>
        </View>
    )
};

export default memo(ScAvatarUpload);