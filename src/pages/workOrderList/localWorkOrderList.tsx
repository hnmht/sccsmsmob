import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Text, IconButton, useTheme, Card, Button, Surface } from "react-native-paper";
import { useSelector } from "react-redux";

import DocList from "../../components/DocList/DocList";
import WOCardContent from "./woCardContent";

import { getLocalWOs, delLocalWO } from "../../db/table/workorderdoc";
import { wosSortByid } from "./constructor";
import { DeepCloneJSON } from "../../utils/tools";
import { reqAddWO } from "../../api/workOrder";
import { transWOToBackend } from "../workOrder/constructor";

const LocalWorkOrderList = (props) => {
    const { navigation, route } = props;
    const [localWOs, setLocalWOs] = useState([]);
    const user = useSelector(state => state.user);
    const theme = useTheme();
    //命令按钮位置
    const { buttonPosition } = useSelector(state => state.swapposition);
    //获取本地暂存指令单
    const handleGetLocalWOs = () => {
        let newWos = getLocalWOs(user.id);
        setLocalWOs(newWos);
    };

    useEffect(() => {
        handleGetLocalWOs();
    }, []);

    //新增
    const handleAdd = () => {
        navigation.navigate("WorkOrderDoc", { isLocal: false, isNew: true, isModify: false, oriWO: undefined, refreshAction: () => handleGetLocalWOs() });
    };
    //删除
    const handleDelete = (item) => {
        //删除本地指令单
        delLocalWO(item);
        //刷新数据
        handleGetLocalWOs();
    };
    //编辑
    const handleEdit = (item) => {
        navigation.navigate("WorkOrderDoc", { isLocal: true, isNew: false, isModify: true, oriWO: item, refreshAction: () => handleGetLocalWOs() });
    };
    //复制新增
    const handleCopyAdd = (item) => {
        navigation.navigate("WorkOrderDoc", { isLocal: false, isNew: true, isModify: false, oriWO: item, refreshAction: () => handleGetLocalWOs() });
    };
    //详情
    const handleDetail = (item) => {
        navigation.navigate("WorkOrderDoc", { isLocal: true, isNew: false, isModify: false, oriWO: item });
    };
    //上传
    const handleUpload = async (item) => {
        let newWO = DeepCloneJSON(item);
        //转换数据到后端格式
        const thisWO = transWOToBackend(newWO);
        thisWO.id = 0
        delete thisWO.isHeaderErr
        delete thisWO.isBodyErr
        let addRes = await reqAddWO(thisWO);
        if (addRes.data.status === 0) {
            delLocalWO(item);
            //刷新数据
            handleGetLocalWOs();
            Alert.alert("提示", `本地指令单L${item.id}上传成功,远程单据编号:${addRes.data.data.billnumber}`);
        } else {
            Alert.alert("错误", `本地指令单L${item.id}上传失败:${addRes.data.statusMsg}`);
            return
        }

    };
    //指令单卡片
    const WOCard = ({ item }) => {
        const wo = item.item;
        return (
            <Card key={wo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <WOCardContent wo={wo} isLocal={true} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="delete" onPress={() => handleDelete(wo)} icon="delete-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEdit(wo)} icon="pencil-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="copyAdd" onPress={() => handleCopyAdd(wo)} icon="plus-box-multiple-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="upload" onPress={() => handleUpload(wo)} disabled={wo.isHeaderErr || wo.isBodyErr} icon="cloud-upload" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleDetail(wo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>

        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={localWOs}
                    ItemElement={WOCard}
                    rowsPerPage={10}
                    searchFields={["id", "billdate", "billnumber", "createuser.name", "department.name"]}
                    sortFunction={wosSortByid}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button icon="plus" iconColor={theme.colors.primary} onPress={handleAdd}>新增</Button>
                <Button icon="refresh" iconColor={theme.colors.primary} onPress={handleGetLocalWOs}>刷新</Button>
            </Surface>
        </View>
    );
};

export default LocalWorkOrderList;