import { useEffect, useState } from "react";
import { View, Alert, Modal } from "react-native";
import { Button, Card, IconButton, Surface, MD3Theme } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import DocList from "../../components/DocList/DocList";
import WORefer from "./WORefer";
import EOCardContent from "./EOCardContent";

import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { reqGetEOList, reqGetEODetail, reqConfirmEO, reqUnConfirmEO, reqDeleteEO } from "../../api/executionOrder";
import { generateEOConditions, generateWOConditions, eoQueryFields, woQueryFields, eosSortByID, transEODetailToFronted } from "./constructor";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { Condition } from "../../dataType/types/queryPanel";
import { WorkOrderRow } from "../../dataType/types/workOrder";

import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface EODiagStatus {
    isOpen: boolean;
    content: 0 | 1 | 2 | 3 | 4;//1 执行单（编辑或查看） 2 执行单过滤条件 3 指令单选择 4 指令单过滤条件
    selectedWOR: WorkOrderRow | undefined;
    selectedEO: ExecutionOrder | undefined;
    isNew: boolean;
    isModify: boolean;
}

interface RemoteEOListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}


function RemoteExecutionOrderList({
    t,
    theme,
    isOffline,
    navigation,
}: RemoteEOListProps) {

    const [remoteEOs, setRemoteEOs] = useState<ExecutionOrder[]>([]);
    const [woConditions, setWoConditions] = useState<Condition[]>(generateWOConditions());
    const [eoConditions, setEoConditions] = useState<Condition[]>(generateEOConditions());
    const [diagStatus, setDiagStatus] = useState<EODiagStatus>({
        isOpen: false,
        content: 0,
        selectedWOR: undefined,
        selectedEO: undefined,
        isNew: false,
        isModify: false
    });
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const user = useAppSelector(state => state.user);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);


    useEffect(() => {
        handleReqEOs(eoConditions);
    }, []);
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    //向服务器请求数据
    const handleReqEOs = async (cons = eoConditions) => {
        setRefreshing(true);
        //将查询条件转化为String
        let queryString = transConditionsToString(cons);
        let eosRes = await reqGetEOList({ queryString: queryString });
        let newEos: ExecutionOrder[] = [];
        if (eosRes.status) {
            newEos = eosRes.data;
        } else {
            Alert.alert("提示", eosRes.msg);
        }
        setRemoteEOs(newEos);
        setRefreshing(false);
    };
    //点击查询执行单按钮
    const handlePressQuery = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    //获取执行单查询条件
    const handleEOQueryOk = (value: Condition[] = eoConditions) => {
        setEoConditions(value);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器请求数据
        handleReqEOs(value);
    };

    //点击参照指令单按钮
    const handleAddRef = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    //参照指令单QueryPanel确定按钮点击
    const handleWoQueryOk = (cons: Condition[] = woConditions) => {
        setWoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };
    //参照指令单按钮点击确定
    const handleWoReferOk = (item: WorkOrderRow) => {
        setDiagStatus({
            isOpen: false,
            content: 0, //显示执行单编辑界面
            selectedWOR: item,
            selectedEO: undefined,
            isNew: true,
            isModify: false
        });
        //导航到执行单编辑界面
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: item, oriEO: undefined, onGoBack: () => handleReqEOs() });
    };

    //增加
    const handleAdd = () => {
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriEO: undefined, onGoBack: () => handleReqEOs() });
    };
    //卡片详情按钮点击
    const handleViewAction = async (item: ExecutionOrder) => {
        let res = await reqGetEODetail(item);
        if (res.status) {
            let eoDetail = transEODetailToFronted(res.data);
            navigation.navigate("ExecutionOrder", { isLocal: false, isNew: false, isModify: false, oriWOR: undefined, oriEO: eoDetail, onGoBack: () => { } });
        } else {
            Alert.alert("错误", res.msg);
            return
        }
    };

    //卡片编辑按钮点击
    const handleEditAction = async (item: ExecutionOrder) => {
        let res = await reqGetEODetail(item);
        if (res.status) {
            let eoDetail = transEODetailToFronted(res.data);
            navigation.navigate("ExecutionOrder", { isLocal: false, isNew: false, isModify: true, oriWOR: undefined, oriEO: eoDetail, onGoBack: () => handleReqEOs() });

        } else {
            Alert.alert("错误", res.msg);
            return
        }
    };
    //卡片确认按钮点击
    const handleConfirm = async (item: ExecutionOrder) => {
        let res = await reqConfirmEO(item);
        if (res.status) {
            Alert.alert("提示", "确认" + item.billNumber + "执行单成功");
        } else {
            Alert.alert("错误", "确认" + item.billNumber + "执行单失败:" + res.msg);
            return
        }
        //刷新数据
        handleReqEOs();
    };

    //卡片取消确认按钮点击
    const handleCancelConfirm = async (item: ExecutionOrder) => {
        let res = await reqUnConfirmEO(item);
        if (res.status) {
            Alert.alert("提示", "取消确认" + item.billNumber + "执行单成功");
        } else {
            Alert.alert("错误", "取消确认" + item.billNumber + "执行单失败:" + res.msg);
            return
        }
        //刷新数据
        handleReqEOs();
    };

    //卡片删除按钮点击
    const handleDelete = async (item: ExecutionOrder) => {
        let res = await reqDeleteEO(item);
        if (res.status) {
            Alert.alert("提示", "删除" + item.billNumber + "执行单成功");
        } else {
            Alert.alert("错误", "删除" + item.billNumber + "执行单失败:" + res.msg);
            return
        }
        //刷新数据
        handleReqEOs();
    };

    //对话框显示内容组件
    const DiagContent = ({ status }: { status: EODiagStatus }) => {
        const content = status.content;
        switch (content) {
            case 1:
                return null;
            case 2:
                return <QueryPanel
                    title="执行单过滤条件"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEOQueryOk}
                    onCancel={handleDiagClose}
                />;
            case 3:
                return <WORefer
                    isOffline={isOffline}
                    filterButtonDisp={true}
                    title={"参照指令单(远程)"}
                    conditions={woConditions}
                    cancelPressAction={handleDiagClose}
                    okPressAction={handleWoReferOk}
                    filterAction={handleAddRef}
                    theme={theme}
                    t={t}
                />;
            case 4:
                return <QueryPanel
                    title="指令单过滤条件"
                    queryFields={woQueryFields}
                    initalConditions={woConditions}
                    onOk={handleWoQueryOk}
                    onCancel={handleDiagClose}
                />;
            default:
                return null;
        }
    };

    const EOCard = ({ item }: { item: ExecutionOrder }) => {
        const eo = item;
        const delDisable = !(eo.status === 0 && eo.creator.id === user.id);
        const editDisable = !(eo.status === 0 && eo.creator.id === user.id);
        const startDisable = !(eo.status === 0);
        const stopDisable = !(eo.status === 1 && eo.confirmer.id === user.id);
        return (
            <Card key={eo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <EOCardContent eo={eo} isLocal={false} t={t} theme={theme} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleCancelConfirm(eo)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(eo)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(eo)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(eo)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(eo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteEOs}
                    ItemElement={EOCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billNumber", "creator.name", "department.name", "sceneitem.name", "eit.name", "starttime", "description"]}
                    sortFunction={eosSortByID}
                    refreshing={refreshing}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={handleAdd} />
                <Button icon="link-plus" textColor={theme.colors.primary} onPress={handleAddRef}>参照新增</Button>
                <Button onPress={handlePressQuery} icon="filter-variant">查询</Button>
            </Surface>
            <Modal
                visible={diagStatus.isOpen}
                onDismiss={handleDiagClose}
            >
                <DiagContent status={diagStatus} />
            </Modal>
        </View>
    );
};

export default RemoteExecutionOrderList;