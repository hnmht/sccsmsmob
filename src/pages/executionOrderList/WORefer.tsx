import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, useTheme, IconButton, AnimatedFAB, Card } from "react-native-paper";
// import dayjs from "dayjs";s
import dayjs from "../../utils/myDayjs";
import { useDispatch, useSelector } from "react-redux";
import { changeSwapPosition } from "../../store/slice/swapPosition";
import DocList from "../../components/DocList/DocList";
import { transConditionsToString } from "../../components/QueryPanel";
import { reqReferWO } from "../../api/workOrder";
import { edsSortByID } from "./constructor";
import { VoucherStatus } from "../../utils/pub";
import { pubParams } from "../../components/pub/pubParms";

const WORefer = ({
    isOffline,
    title,
    conditions,
    cancelClickAction,
    okClickAction,
    fileterButtonDisp,
    filterAction
}) => {
    const [rows, setRows] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const dispatch = useDispatch();
    const worefs = useSelector(state => state.dynamicdata.worefs);
    //命令按钮位置
    const { buttonPosition, swapPosition, orderPosition } = useSelector(state => state.swapposition);
    //切换命令按钮位置
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    useEffect(() => {
        async function reqData() {
            setRefreshing(true);
            let newRows = [];
            if (isOffline === 0) {
                let querystring = transConditionsToString(conditions);
                const res = await reqReferWO({ querystring: querystring });
                if (res.data.status === 0) {
                    newRows = res.data.data;
                }
            } else {
                newRows = worefs;
            }
            setRows(newRows);
            setRefreshing(false);
        }
        reqData();
    }, [conditions, isOffline]);

    const WORCard = ({ item }) => {
        const wor = item.item;
        return (
            <Card key={wor.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity onPress={() => okClickAction(wor)} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", margin: 4 }}>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }} >现场: {wor.sceneitem.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }}>执行模板: {wor.eit.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>开始时间: {dayjs(wor.starttime).format("YYYY-MM-DD HH:mm")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>结束时间: {dayjs(wor.endtime).format("YYYY-MM-DD HH:mm")}</Text>
                    <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "70%" }}>单据编号: {wor.billnumber}</Text>
                    <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "30%" }}>行号: {wor.rownumber}</Text>
                    <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>单据日期: {dayjs(wor.billdate).format("YYYY-MM-DD")}</Text>
                    <Text variant="titleMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>执行人: {wor.execperson.name}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>行说明: {wor.description}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }} >表头说明: {wor.description}</Text>
                    <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>行状态: {VoucherStatus[wor.status]}</Text>
                    <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>制单人: {wor.createuser.name}</Text>
                    <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>部门: {wor.department.name}</Text>
                    <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>确认人: {wor.confirmuser.name}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>确认时间: {dayjs(wor.confirmdate).format("YYYY-MM-DD HH:mm")}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 40,
                width: "100%",
                backgroundColor: theme.colors.background
            }}>
                <View style={{ padding: 4, minHeight: 40, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text variant="titleMedium">{title}</Text>
                    {fileterButtonDisp
                        ? <IconButton icon="filter-variant" iconColor={theme.colors.primary} onPress={filterAction} />
                        : null
                    }
                </View>
            </View>
            <View style={{ flex: 1, width: "100%" }}>
                <DocList
                    rows={rows}
                    ItemElement={WORCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billnumber", "eit.name", "createuser.name", "confirmuser.name", "department.name", "starttime", "endtime"]}
                    sortFunction={edsSortByID}
                    refreshing={refreshing}
                />
            </View>
            <AnimatedFAB
                icon="keyboard-return"
                label="返回"
                extended={false}
                visible={true}
                onPress={cancelClickAction}
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
        </View>
    );
};

export default WORefer;

WORefer.defaultProps = {
    isOffline: 0,
    title: "参照指令单",
    conditions: [],
    cancelClickAction: () => { },
    okClickAction: () => { },
    fileterButtonDisp: true,
    filterAction: () => { }
};
