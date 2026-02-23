import { useEffect, useState } from "react";
import { View, Alert, Modal } from "react-native";
import { Button, Card, IconButton, useTheme, Surface } from "react-native-paper";
import DocList from "../../components/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import WOCardContent from "./woCardContent";
import { reqGetWOList, reqGetWODetail, reqConfirmWO, reqCancelConfirmWO, reqDeleteWO } from "../../api/workOrder";
import { generateConditions, queryFields, wosSortByid, transWoDetailToFronted } from "./constructor";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";


const RemoteWorkOrderList = () => {
    const navigation = useBusinessNavigation();
    const [remoteWOs, setRemoteWOs] = useState([]);
    const [showQueryPanel, setShowQueryPanel] = useState(false);
    const [conditions, setConditions] = useState(generateConditions());
    const theme = useTheme();
    const user = useAppSelector(state => state.user);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);


    useEffect(() => {
        handleReqWOs(conditions);
    }, []);

    //获取查询条件
    const handleGetConditions = (value, itemKey, positionID, rowIndex, err) => {
        setShowQueryPanel(false);
        setConditions(value);
        //向服务器请求数据
        handleReqWOs(value);
    };

    //向服务器请求数据
    const handleReqWOs = async (cons = conditions) => {
        //将查询条件转化为String
        let queryString = transConditionsToString(cons);
        let wosRes = await reqGetWOList({ queryString: queryString });
        let newWos = [];
        if (wosRes.status) {
            newWos = wosRes.data;
        } else {
            Alert.alert("错误", wosRes.msg);
        }
        setRemoteWOs(newWos);
    };

    //增加
    const handleAddWO = () => {
        navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: undefined, refreshAction: () => handleReqWOs() });
    };
    //卡片详情按钮点击
    const handleViewAction = async (item) => {
        let res = await reqGetWODetail(item);
        if (res.data.status === 0) {
            let woDetail = transWoDetailToFronted(res.data);
            navigation.navigate("WorkOrder", { isLocal: false, isNew: false, isModify: false, oriWO: woDetail });
        } else {
            Alert.alert("错误", res.msg);
            return
        }
    };
    //卡片复制新增按钮点击
    const handleCopyAdd = async (item) => {
        let res = await reqGetWODetail(item);
        if (res.data.status === 0) {
            let woDetail = transWoDetailToFronted(res.data);
            navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: woDetail, refreshAction: () => handleReqWOs() });
        } else {
            Alert.alert("错误", res.msg);
            return
        }
    };

    //卡片编辑按钮点击
    const handleEditAction = async (item) => {
        let res = await reqGetWODetail(item);
        if (res.data.status === 0) {
            let woDetail = transWoDetailToFronted(res.data.data);
            navigation.navigate("WorkOrderDoc", { isLocal: false, isNew: false, isModify: true, oriWO: woDetail, refreshAction: () => handleReqWOs() });

        } else {
            Alert.alert("错误", res.data.statusMsg);
            return
        }
    };
    //卡片确认按钮点击
    const handleConfirm = async (item) => {
        let res = await reqConfirmWO(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "确认" + item.billnumber + "指令单成功");
        } else {
            Alert.alert("错误", "确认" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqWOs();
    };

    //卡片取消确认按钮点击
    const handleCancelConfirm = async (item) => {
        let res = await reqCancelConfirmWO(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "取消确认" + item.billnumber + "指令单成功");
        } else {
            Alert.alert("错误", "取消确认" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqWOs();
    };

    //卡片删除按钮点击
    const handleDelete = async (item) => {
        let res = await reqDeleteWO(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "删除" + item.billnumber + "指令单成功");
        } else {
            Alert.alert("错误", "删除" + item.billnumber + "指令单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqWOs();
    };

    const WOCard = ({ item }) => {
        const wo = item.item;
        const delDisable = !(wo.status === 0 && wo.createuser.id === user.id);
        const editDisable = !(wo.status === 0 && wo.createuser.id === user.id);
        const startDisable = !(wo.status === 0);
        const stopDisable = !(wo.status === 1 && wo.confirmuser.id === user.id);

        return (
            <Card key={wo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <WOCardContent wo={wo} isLocal={false} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleCancelConfirm(wo)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(wo)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(wo)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(wo)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="copyAdd" onPress={() => handleCopyAdd(wo)} icon="plus-box-multiple-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(wo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteWOs}
                    ItemElement={WOCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billnumber", "createuser.name", "department.name"]}
                    sortFunction={wosSortByid}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button icon="plus" onPress={handleAddWO}>新增</Button>
                <Button onPress={() => setShowQueryPanel(true)} icon="filter-variant">查询</Button>
            </Surface>
            <Modal
                visible={showQueryPanel}
                onDismiss={() => setShowQueryPanel(false)}
            >
                <QueryPanel
                    onCancel={() => setShowQueryPanel(false)}
                    title="过滤条件"
                    queryFields={queryFields}
                    initalConditions={conditions}
                    onOk={handleGetConditions}
                />
            </Modal>
        </View>
    );
};

export default RemoteWorkOrderList;