import { useEffect, useState } from "react";
import { View, Alert, Modal } from "react-native";
import { IconButton, Card, Button, Surface, MD3Theme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import DocList from "../../components/DocList/DocList";
import WORefer from "./WORefer";
import EOCardContent from "./EOCardContent";
import { getAllDynamicDataOnline } from "../../store/pub";
import { updateDynamicWORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { eosSortByID } from "./constructor";
import { transEOToBackend, transVoucherDataToFiles } from "../executionOrder/constructor";
import { reqAddEO } from "../../api/executionOrder";
import { updateWORefStatus, getLocalWOR } from "../../db/crud/workorderref";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { EORepo } from "../../db/crud/executionOrder";
import { WorkOrderRow } from "../../dataType/types/workOrder";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface LocalEOListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}

function LocalEOList({
    t,
    theme,
    isOffline,
    navigation,
}: LocalEOListProps) {
    const [localEOs, setLocalEOs] = useState<ExecutionOrder[]>([]);
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
    });
    const user = useAppSelector(state => state.user);
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const dispatch = useAppDispatch();

    // Get Local Execution Order list
    const handleGetLocalEOs = (shouldRefresh: boolean = true) => {
        if (!shouldRefresh) {
            return
        }
        let newEOs = EORepo.getUserVouchers(user.id);
        setLocalEOs(newEOs);
    };

    useEffect(() => {
        handleGetLocalEOs(true);
    }, []);

    // Close Reference Work Order Dialog
    const handleDialogClose = () => {
        setDiagStatus({
            isOpen: false
        });
    };
    // Actions after press ok in reference work order dialog
    const handleWoReferOk = (item: WorkOrderRow) => {
        setDiagStatus({
            isOpen: false
        });
        // Navigate to eh ExecutionOrder page
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: item, oriEO: undefined, onGoBack: handleGetLocalEOs });
    };
    // Actions after press add button
    const handleAdd = () => {
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriEO: undefined, onGoBack: handleGetLocalEOs });
    };
    // Delete local Execution Order
    const handleDelete = (item: ExecutionOrder) => {
        // Update the lcoal woref data status
        if (item.sourceBID !== 0 && isOffline) {
            updateWORefStatus(item.sourceBID, 1);
            // Refresh Redux
            const worefs = getLocalWOR();
            dispatch(updateDynamicWORefs(worefs));
        }
        // Delete local Execution Order
        EORepo.delVoucher(item);
        // Refresh Execution Order list
        handleGetLocalEOs(true);
    };
    // Actions after press Edit button 
    const handleEdit = (item: ExecutionOrder) => {
        navigation.navigate("ExecutionOrder", { isLocal: true, isNew: false, isModify: true, oriWOR: undefined, oriEO: item, onGoBack: handleGetLocalEOs });
    };
    // Actions after press detail button
    const handleDetail = (item: ExecutionOrder) => {
        navigation.navigate("ExecutionOrder", { isLocal: true, isNew: false, isModify: false, oriWOR: undefined, oriEO: item, onGoBack: handleGetLocalEOs });
    };
    //上传
    const handleUpload = async (item: ExecutionOrder) => {
        const thisEO = transEOToBackend(item);
        //处理指令单文件
        setOverlayStatus({ visible: true, description: "正在上传文件..." });
        try {
            const filesArr = transVoucherDataToFiles(thisEO);
            if (filesArr.length > 0) { //如果存在文件则需要先上传文件
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (!getFilesHashRes.status) {
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
                //上传文件
                let willUploadFileNumber = 0;
                let willUploadFiles = getFilesHashRes.data;
                let formData = new FormData(); //准备formData
                for (let i = 0; i < willUploadFiles.length; i++) {
                    if (willUploadFiles[i].id === 0) {
                        willUploadFileNumber++
                        let file = { uri: willUploadFiles[i].filePath, type: willUploadFiles[i].mime, name: willUploadFiles[i].originFileName };
                        formData.append("files", file);
                        formData.append("filekey", i);
                        formData.append("filehash", willUploadFiles[i].hash);
                        formData.append("filename", willUploadFiles[i].originFileName);
                        formData.append("filetype", willUploadFiles[i].fileType);
                        formData.append("isimage", willUploadFiles[i].isImage);
                        formData.append("model", willUploadFiles[i].model); //相机型号
                        formData.append("DateTimeOriginal", willUploadFiles[i].dateTimeOriginal); //初始拍摄时间
                        formData.append("latitude", willUploadFiles[i].latitude);//纬度
                        formData.append("longitude", willUploadFiles[i].longitude);//经度 
                        formData.append("source", willUploadFiles[i].source);// 来源
                        //从fileArr中删除
                        willUploadFiles.splice(i, 1);
                        i--;
                    }
                };

                if (willUploadFileNumber > 0) {
                    const uploadRes = await reqUploadFiles(formData, false);    //将未获取hash值的文件进行上传
                    if (!uploadRes.status) {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                    //根据返回的数据修改服务器返回的文件列表
                    const uploadFiles = uploadRes.data;
                    //合并fileArr1 和 uploadFiles
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                //创建fileMap
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });
                //修改单据表体所有文件的id
                thisEO.body.map(row => {
                    row.files.map((rowFile) => {
                        if (rowFile.file.id === 0) {
                            rowFile.file = fileMap.get(rowFile.file.hash);
                        }
                    })
                });
            }
            setOverlayStatus({ visible: true, description: "正在上传单据..." });

            thisEO.id = 0
            delete thisEO.errData;
            let addRes = await reqAddEO(thisEO);
            if (addRes.data.status === 0) {
                EORepo.delVoucher(item);
                Alert.alert("提示", "新增执行单成功,单据编号:" + addRes.data.billNumber);
            } else {
                setOverlayStatus({ visible: false, description: "" });
                return
            }
        }
        catch (err) {
            setOverlayStatus({ visible: false, description: "" });
            return
        }
        setOverlayStatus({ visible: false, description: "" });
        //如果指令单参照单据生成,则刷新worefs
        if (thisEO.sourceType !== "UA") {
            getAllDynamicDataOnline();

        }
        //刷新数据
        handleGetLocalEOs();
    };
    //指令单卡片
    const EOCard = ({ item }: { item: ExecutionOrder }) => {
        const eo = item;
        const canUpload: boolean = eo.errData?.isErr ?? false;
        return (
            <Card key={eo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <EOCardContent eo={eo} isLocal={true} theme={theme} t={t} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="delete" onPress={() => handleDelete(eo)} icon="delete-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEdit(eo)} icon="pencil-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="upload" onPress={() => handleUpload(eo)} disabled={canUpload || isOffline} icon="cloud-upload" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleDetail(eo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />

            <View style={{ flex: 1 }}>
                <DocList
                    rows={localEOs}
                    ItemElement={EOCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billnumber", "createuser.name", "department.name", "sceneitem.name", "eit.name", "starttime", "description"]}
                    sortFunction={eosSortByID}
                    refreshing={false}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={handleAdd} />
                <Button icon="link-plus" textColor={theme.colors.primary} onPress={() => setDiagStatus({ isOpen: true })} disabled={isOffline}>参照新增</Button>
                <Button icon="refresh" textColor={theme.colors.primary} onPress={() => handleGetLocalEOs(true)}>刷新</Button>
            </Surface>
            <Modal
                visible={diagStatus.isOpen}
                onDismiss={handleDialogClose}
            >
                <WORefer
                    title={"参照指令单(本地)"}
                    isOffline={isOffline}
                    cancelPressAction={handleDialogClose}
                    okPressAction={handleWoReferOk}
                    filterButtonDisp={false}
                    conditions={[]}
                    filterAction={() => { }}
                    theme={theme}
                    t={t}
                />
            </Modal>
        </View>
    );
};

export default LocalEOList;
