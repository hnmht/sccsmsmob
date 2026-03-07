import { useEffect, useState } from "react";
import { View, Alert, Modal } from "react-native";
import { Button, Card, Text, IconButton, useTheme, Surface } from "react-native-paper";
import { useSelector } from "react-redux";

import DocList from "../../components/DocList/DocList";
import WORefer from "./woRefer";
import EDCardContent from "./edCardContent";

import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { reqGetEDList, reqGetEDDetail, reqConfirmED, reqCancelConfirmED, reqDeleteED } from "../../api/executeDoc";
import { generateEDConditions, generateWOConditions, edQueryFields, woQueryFields, edsSortByID, transEDDetailToFronted } from "./constructor";

const RemoteExecuteDocList = (props) => {
    const { navigation } = props;
    const [remoteEDs, setRemoteEDs] = useState([]);
    const [woConditions, setWoConditions] = useState(generateWOConditions());
    const [edConditions, setEdConditions] = useState(generateEDConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 执行单（编辑或查看） 2 执行单过滤条件 3 指令单选择 4 指令单过滤条件
        selectedWOR: undefined,
        selectedED: undefined,
        isNew: false,
        isModify: false
    });
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const user = useSelector(state => state.user);
    //命令按钮位置
    const { buttonPosition } = useSelector(state => state.swapposition);


    useEffect(() => {
        handleReqEDs(edConditions);
    }, []);
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };

    //向服务器请求数据
    const handleReqEDs = async (cons = edConditions) => {
        setRefreshing(true);
        //将查询条件转化为String
        let queryString = transConditionsToString(cons);
        let edsRes = await reqGetEDList({ queryString: queryString });
        let newEds = [];
        if (edsRes.data.status === 0) {
            newEds = edsRes.data.data;
        } else {
            Alert.alert("提示", edsRes.data.statusMsg);
        }
        setRemoteEDs(newEds);
        setRefreshing(false);
    };
    //点击查询执行单按钮
    const handlePressQuery = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };

    //获取执行单查询条件
    const handleEdQueryOk = (value, itemKey, positionID, rowIndex, err) => {
        setEdConditions(value);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
        //向服务器请求数据
        handleReqEDs(value);
    };

    //点击参照指令单按钮
    const handleAddRef = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };

    //参照指令单QueryPanel确定按钮点击
    const handleWoQueryOk = (cons) => {
        setWoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedWOR: undefined,
            selectedED: undefined,
            isNew: false,
            isModify: false
        });
    };
    //参照指令单按钮点击确定
    const handleWoReferOk = (item) => {
        setDiagStatus({
            isOpen: false,
            content: 0, //显示执行单编辑界面
            selectedWOR: item,
            selectedED: undefined,
            isNew: true,
            isModify: false
        });
        //导航到执行单编辑界面
        navigation.navigate("ExecuteDoc", { isLocal: false, isNew: true, isModify: false, oriWOR: item, oriED: undefined, refreshAction: () => handleReqEDs() });
    };

    //增加
    const handleAdd = () => {
        navigation.navigate("ExecuteDoc", { isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriED: undefined, refreshAction: () => handleReqEDs() });
    };
    //卡片详情按钮点击
    const handleViewAction = async (item) => {
        let res = await reqGetEDDetail(item);
        if (res.data.status === 0) {
            let edDetail = transEDDetailToFronted(res.data.data);
            navigation.navigate("ExecuteDoc", { isLocal: false, isNew: false, isModify: false, oriWOR: undefined, oriED: edDetail });
        } else {
            Alert.alert("错误", res.data.statusMsg);
            return
        }
    };

    //卡片编辑按钮点击
    const handleEditAction = async (item) => {
        let res = await reqGetEDDetail(item);
        if (res.data.status === 0) {
            let edDetail = transEDDetailToFronted(res.data.data);
            navigation.navigate("ExecuteDoc", { isLocal: false, isNew: false, isModify: true, oriWOR: undefined, oriED: edDetail, refreshAction: () => handleReqEDs() });

        } else {
            Alert.alert("错误", res.data.statusMsg);
            return
        }
    };
    //卡片确认按钮点击
    const handleConfirm = async (item) => {
        let res = await reqConfirmED(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "确认" + item.billnumber + "执行单成功");
        } else {
            Alert.alert("错误", "确认" + item.billnumber + "执行单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqEDs();
    };

    //卡片取消确认按钮点击
    const handleCancelConfirm = async (item) => {
        let res = await reqCancelConfirmED(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "取消确认" + item.billnumber + "执行单成功");
        } else {
            Alert.alert("错误", "取消确认" + item.billnumber + "执行单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqEDs();
    };

    //卡片删除按钮点击
    const handleDelete = async (item) => {
        let res = await reqDeleteED(item);
        if (res.data.status === 0) {
            Alert.alert("提示", "删除" + item.billnumber + "执行单成功");
        } else {
            Alert.alert("错误", "删除" + item.billnumber + "执行单失败:" + res.data.statusMsg);
            return
        }
        //刷新数据
        handleReqEDs();
    };

    //对话框显示内容组件
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return null;
            case 2:
                return <QueryPanel
                    title="执行单过滤条件"
                    queryFields={edQueryFields}
                    initalConditions={edConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="edQueryPanel" />;
            case 3:
                return <WORefer
                    title={"参照指令单(远程)"}
                    conditions={woConditions}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleWoReferOk}
                    filterAction={handleAddRef}
                />;
            case 4:
                return <QueryPanel
                    title="指令单过滤条件"
                    queryFields={woQueryFields}
                    initalConditions={woConditions}
                    onOk={handleWoQueryOk}
                    onCancel={handleDiagClose}
                    id="woQureyPanel" />;
            default:
                return null;
        }
    };

    const EDCard = ({ item }) => {
        const ed = item.item;
        const delDisable = !(ed.status === 0 && ed.createuser.id === user.id);
        const editDisable = !(ed.status === 0 && ed.createuser.id === user.id);
        const startDisable = !(ed.status === 0);
        const stopDisable = !(ed.status === 1 && ed.confirmuser.id === user.id);

        return (
            <Card key={ed.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <EDCardContent ed={ed} isLocal={false} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleCancelConfirm(ed)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(ed)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(ed)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(ed)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(ed)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteEDs}
                    ItemElement={EDCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billnumber", "createuser.name", "department.name", "sceneitem.name", "eit.name", "starttime", "description"]}
                    sortFunction={edsSortByID}
                    refreshing={refreshing}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={handleAdd} />
                <Button icon="link-plus" iconColor={theme.colors.primary} onPress={handleAddRef}>参照新增</Button>
                <Button onPress={handlePressQuery} icon="filter-variant">查询</Button>
            </Surface>
            <Modal
                visible={diagStatus.isOpen}
                onDismiss={handleDiagClose}
            >
                <DiagContent content={diagStatus.content} />
            </Modal>
        </View>
    );
};

export default RemoteExecuteDocList;