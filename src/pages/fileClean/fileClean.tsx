import { useEffect, useState } from "react";
import { Text, Button, Card, useTheme, Divider } from "react-native-paper";
import { ScrollView, View, PermissionsAndroid, Platform, Alert } from "react-native";
import RNFS from "react-native-fs";

import { dayjs } from "../../i18n/dayjs";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";

import { IRFRepo } from "../../db/crud/issueResolutionForm";
import { EORepo } from "../../db/crud/executionOrder";
import { WORepo } from "../../db/crud/workorder";

import { WorkOrder } from "../../dataType/types/workOrder";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import type { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { useSettingNavigation } from "../../navigation/config/screenParams";

const externalDir = `${RNFS.ExternalDirectoryPath}/Pictures`;
const cacheDir = RNFS.CachesDirectoryPath;
const maxScale = 1.2;

const calculationFiles = (files: RNFS.ReadDirItem[]) => {
    let number: number = 0;
    let sizeByte: number = 0;
    let sizeMB: number = 0;

    if (files instanceof Array) {
        files.forEach(file => {
            if (file.isFile()) {
                number = number + 1;
                sizeByte = sizeByte + file.size;
            }
        });
        if (sizeByte > 0) {
            sizeMB = parseFloat((sizeByte / (1024 * 1024)).toFixed(2));
        }
    }
    return { number: number, size: sizeMB }
};

function FileCleaning() {
    const theme = useTheme();
    const navigation = useSettingNavigation();
    const [externalFileInfo, setExternalFileInfo] = useState({ number: 0, size: 0 });
    const [cacheFileInfo, setCacheFileInfo] = useState({ number: 0, size: 0 });
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [wos, setWos] = useState<WorkOrder[]>([]);
    const [eds, setEds] = useState<ExecutionOrder[]>([]);
    const [dds, setDds] = useState<IssueResolutionForm[]>([]);
    const cacheCleanDisabled = cacheFileInfo.number === 0 || (eds.length + dds.length) > 0;
    //授权
    useEffect(() => {
        const checkPermisson = async () => {
            if (Platform.OS === "web") {
                return
            }
            try {
                if (Platform.OS === "android") {
                    const readMediaGranted = await PermissionsAndroid.check("android.permission.READ_MEDIA_IMAGES");
                    const readStorageGranted = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE");
                    const writeStorageGranted = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE");
                    const mediaLocationGranted = await PermissionsAndroid.check("android.permission.ACCESS_MEDIA_LOCATION");

                    if (Platform.Version >= 33) {
                        if (!readMediaGranted || !mediaLocationGranted) {
                            Alert.alert(
                                "提示",
                                `现场管理系统还未填写带有附件的执行单和问题处理单,无需清理!`,
                                [
                                    {
                                        text: "确定",
                                        onPress: () => navigation.goBack(),
                                        style: "cancel"
                                    },
                                ],
                            );
                        }
                    } else {
                        if (!readStorageGranted || !writeStorageGranted) {
                            Alert.alert(
                                "提示",
                                `现场管理系统还未填写带有附件的执行单和问题处理单,无需清理!`,
                                [
                                    {
                                        text: "确定",
                                        onPress: () => navigation.goBack(),
                                        style: "cancel"
                                    }
                                ],
                            );
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkPermisson();
    }, []);

    useEffect(() => {
        function getLocalData() {
            const newWOs = WORepo.getAllVouchers();
            const newDDs = IRFRepo.getAllVouchers();
            const newEDs = EORepo.getAllVouchers();
            setWos(newWOs);
            setEds(newEDs);
            setDds(newDDs);
        }
        getLocalData();
    }, []);

    useEffect(() => {
        async function getFilesInfo() {
            let pictureDirs: RNFS.ReadDirItem[] = [];
            let pictureDirExist = await RNFS.exists(externalDir);
            if (pictureDirExist) {
                pictureDirs = await RNFS.readDir(externalDir);
            }
            const cacheDirs = await RNFS.readDir(cacheDir);
            const pictureFileInfo = calculationFiles(pictureDirs);
            const cacheInfo = calculationFiles(cacheDirs);
            setExternalFileInfo(pictureFileInfo);
            setCacheFileInfo(cacheInfo);
        }
        getFilesInfo();
    }, []);

    //清理原始照片
    const handleCleanNativePicture = async () => {
        setOverlayStatus({ visible: true, description: "正在删除原始图片..." });
        let dirs = await RNFS.readDir(externalDir);
        dirs.forEach(async (file) => {
            if (file.isFile()) {
                await RNFS.unlink(file.path);
            }
        });
        dirs = await RNFS.readDir(externalDir);
        const fileInfo = calculationFiles(dirs);
        setExternalFileInfo(fileInfo);
        setOverlayStatus({ visible: false, description: "" });
    };
    //清理原始照片提示
    const handleCleanNativePictureAlert = () => {
        Alert.alert("警告", "本操作将删除所有原始照片,且不可恢复,是否继续！", [
            {
                text: "取消",
                onPress: () => { return }
            },
            {
                text: "确定",
                onPress: () => handleCleanNativePicture()
            }
        ]);
    };

    //清理单据附件
    const handleCleanVoucherFile = async () => {
        setOverlayStatus({ visible: true, description: "正在删除单据附件..." });
        //删除cache中image_cache文件夹
        await RNFS.unlink(`${cacheDir}/image_cache`);
        //删除文件
        let dirs = await RNFS.readDir(cacheDir);
        dirs.forEach(async (file) => {
            if (file.isFile()) {
                await RNFS.unlink(file.path);
            }
        });
        dirs = await RNFS.readDir(cacheDir);
        const fileInfo = calculationFiles(dirs);
        setCacheFileInfo(fileInfo);
        setOverlayStatus({ visible: false, description: "" });
    };

    //删除全部本地单据提示
    const handleDelAllLocalVoucherPress = async () => {
        Alert.alert("警告", "本操作将删除所有本地单据,且不可恢复,是否继续！", [
            {
                text: "取消",
                onPress: () => { return }
            },
            {
                text: "确定",
                onPress: () => handleDelAllLocalVoucher()
            }
        ]);
    };

    //删除所有本地单据
    const handleDelAllLocalVoucher = () => {
        setOverlayStatus({ visible: true, description: "正在删除本地单据..." });
        if (wos.length > 0) {
            WORepo.delAllVouchers(); //删除所有本地指令单
        }
        if (eds.length > 0) {
            EORepo.delAllVouchers(); //删除所有本地执行单
        }
        if (dds.length > 0) {
            IRFRepo.delAllVouchers(); //删除所有本地问题处理单
        }

        //刷新本地单据
        const newWOs = WORepo.getAllVouchers();
        const newDDs = IRFRepo.getAllVouchers();
        const newEDs = EORepo.getAllVouchers();
        setWos(newWOs);
        setEds(newEDs);
        setDds(newDDs);
        setOverlayStatus({ visible: false, description: "" });
    }
    //逐个删除本地指令单
    const handleDeleteLocalWO = (wo: WorkOrder) => {
        //删除指令单
        WORepo.delVoucher(wo);
        //重新获取本地指令单
        const newWOs = WORepo.getAllVouchers();
        setWos(newWOs);
    };
    //逐个删除本地执行单
    const handleDeleteLocalED = (ed: ExecutionOrder) => {
        //删除执行单
        EORepo.delVoucher(ed);

        //重新获取本地执行单
        const newEDs = EORepo.getAllVouchers();
        setEds(newEDs);
    };
    //逐个删除本地问题处理单
    const handleDeleteLocalDD = (dd: IssueResolutionForm) => {
        //删除
        IRFRepo.delVoucher(dd);
        //重新获取本地单据
        const newDDs = IRFRepo.getAllVouchers();
        setDds(newDDs);
    };

    return (
        <View style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            // closeAction={() => setOverlayStatus({ visible: false, goBackDisabled: false, description: "" })}
            />
            <ScrollView>
                <Card style={{ marginHorizontal: 4, marginTop: 16, marginBottom: 8 }}>
                    <Card.Title
                        title={"原始照片"}
                        titleMaxFontSizeMultiplier={maxScale}
                    />
                    <Card.Content>
                        <Text variant="bodyMedium" maxFontSizeMultiplier={maxScale} style={{ width: "100%", color: theme.colors.primary }}>
                            使用相机拍摄照片时,原始照片被存储到手机中(上传照片为处理后的照片),本功能可删除这些照片,释放手机存储空间.
                        </Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`存放位置：${externalDir}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`文件数量: ${externalFileInfo.number}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`占用空间：${externalFileInfo.size}M`}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="text"
                            disabled={externalFileInfo.number === 0}
                            textColor={theme.colors.error}
                            onPress={handleCleanNativePictureAlert}
                        >
                            全部删除
                        </Button>
                    </Card.Actions>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={"本地单据"}
                        titleMaxFontSizeMultiplier={1.5}
                    />
                    <Card.Content>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.primary }}>
                            前登录用户及其他用户在本机暂存未上传单据.
                        </Text>
                        <Divider />
                        {wos.length > 0
                            ? <>
                                <Text maxFontSizeMultiplier={maxScale} variant="titleMedium">指令单</Text>
                                {wos.map(wo => {
                                    return (
                                        <View key={wo.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{dayjs(wo.billDate).format("YY-MM-DD")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LW${wo.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{wo.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalWO(wo)}
                                            >
                                                删除
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                        {eds.length > 0
                            ? <>
                                <Text variant="titleMedium">执行单</Text>
                                {eds.map(ed => {
                                    return (
                                        <View key={ed.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{dayjs(ed.billDate).format("YY-MM-DD")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LE${ed.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{ed.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalED(ed)}
                                            >
                                                删除
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                        {dds.length > 0
                            ? <>
                                <Text variant="titleMedium">问题处理单</Text>
                                {dds.map(dd => {
                                    return (
                                        <View key={dd.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{dayjs(dd.billDate).format("YY-MM-DD")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LD${dd.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{dd.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalDD(dd)}
                                            >
                                                删除
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="text"
                            disabled={(wos.length + eds.length + dds.length) === 0}
                            textColor={theme.colors.error}
                            onPress={handleDelAllLocalVoucherPress}
                        >
                            全部删除
                        </Button>
                    </Card.Actions>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={"单据附件"}
                        titleMaxFontSizeMultiplier={1.5}
                    />
                    <Card.Content>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.primary }}>
                            清理执行单和问题处理单上传以后,留存在本机的单据附件.
                        </Text>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.error }}>
                            全部删除本地执行单和问题处理单后才能清理
                        </Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`存放位置：${cacheDir}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`文件数量: ${cacheFileInfo.number}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`占用空间：${cacheFileInfo.size}M`}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="text"
                            textColor={theme.colors.error}
                            disabled={cacheCleanDisabled}
                            onPress={handleCleanVoucherFile}
                        >
                            全部删除
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView>
            <View style={{ width: "100%", alignItems: "center", justifyContent: "center", margin: 8 }}>
                <Button mode="elevated" onPress={() => navigation.goBack()} style={{ width: "40%" }} >返回</Button>
            </View>
        </View>
    )
};

export default FileCleaning;


/* async function checkPermisson() {
    if (Platform.OS === "web") {
        return
    }
    try {
        if (Platform.OS === "android") {
            // const cameraGranted = await PermissionsAndroid.check('android.permission.CAMERA');
            // const locationGranted = await PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION");
            // const mediaLocationGranted = await PermissionsAndroid.check("android.permission.ACCESS_MEDIA_LOCATION");
            const readMediaGranted = await PermissionsAndroid.check("android.permission.READ_MEDIA_IMAGES");
            const readStorageGranted = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE");
            const writeStorageGranted = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE");
            let reqPermissons = {};

            if (Platform.Version >= 33) {
                if (!readMediaGranted || !mediaLocationGranted) {
                    reqPermissons = await PermissionsAndroid.requestMultiple([
                        // PermissionsAndroid.PERMISSIONS.CAMERA,
                        // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    ]);
                }
            } else {
                if (!readStorageGranted || !writeStorageGranted)
                    reqPermissons = await PermissionsAndroid.requestMultiple(
                        [
                            // PermissionsAndroid.PERMISSIONS.CAMERA,
                            // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                        ]
                    );
            }
            let denyNumber = 0;
            for (let key in reqPermissons) {
                if (reqPermissons[key] !== "granted") {
                    denyNumber++
                }
            }

            if (denyNumber > 0) {
                Alert.alert(
                    "错误",
                    "组件需要的权限没有正确获取,界面将关闭!",
                    [{
                        text: "确定",
                        onPress: () => onCancel()
                    }]
                )
            }
        }
    } catch (err) {
        console.error(err);
    }
}
checkPermisson(); */