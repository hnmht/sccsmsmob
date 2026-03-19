import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, IconButton, Card, MD3Theme } from "react-native-paper";
import { DateTimeFormat } from "../../i18n/dayjs";
import { VoucherStatus } from "../../constant/voucherStatus";
import DocList from "../../components/DocList/DocList";
import { transConditionsToString } from "../../components/QueryPanel";
import { reqReferWO } from "../../api/workOrder";
import { Condition } from "../../dataType/types/queryPanel";
import { TFunction } from "i18next";
import {  useAppSelector } from "../../store/hooks";
import { WorkOrderRow } from "../../dataType/types/workOrder";
import { worsSortByid } from "./constructor";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

interface WOReferProps {
    isOffline: boolean;
    title: string;
    conditions: Condition[];
    cancelPressAction: () => void;
    okPressAction: (wor: WorkOrderRow) => void;
    filterButtonDisp: boolean;
    filterAction: () => void;
    theme: MD3Theme;
    t: TFunction
}

function WORefer({
    isOffline = false,
    title = "generateRefWO",
    conditions = [],
    cancelPressAction,
    okPressAction,
    filterButtonDisp = true,
    filterAction,
    theme,
    t,
}: WOReferProps) {
    const [rows, setRows] = useState<WorkOrderRow[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const woRefs = useAppSelector(state => state.dynamicData.woRefs);  

    useEffect(() => {
        async function reqData() {
            setRefreshing(true);
            let newRows: WorkOrderRow[] = [];
            if (!isOffline) {
                let querystring = transConditionsToString(conditions);
                const res = await reqReferWO({ queryString: querystring });
                if (res.status) {
                    newRows = res.data;
                }
            } else {
                newRows = woRefs;
            }
            setRows(newRows);
            setRefreshing(false);
        }
        reqData();
    }, [conditions, isOffline]);

    const WORCard = ({ item }: { item: WorkOrderRow }) => {
        const wor = item;
        return (
            <Card key={wor.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity onPress={() => okPressAction(wor)} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", margin: 4 }}>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }} >现场: {wor.csa.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }}>执行模板: {wor.ept.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>开始时间: {DateTimeFormat(wor.startTime, "LLL")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>结束时间: {DateTimeFormat(wor.endTime, "LLL")}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>单据编号: {wor.billNumber}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>行号: {wor.rowNumber}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>单据日期: {DateTimeFormat(wor.billDate, "LL")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>执行人: {wor.executor.name}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>行说明: {wor.description}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }} >表头说明: {wor.description}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>行状态: {VoucherStatus[wor.status]}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>制单人: {wor.creator.name}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>部门: {wor.department.name}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>确认人: {wor.confirmer.name}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>确认时间: {DateTimeFormat(wor.confirmDate, "LLL")}</Text>
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
                    {filterButtonDisp
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
                    searchFields={["billDate", "billNumber", "ept.name", "creator.name", "confirmer.name", "department.name", "startTime", "endTime"]}
                    sortFunction={worsSortByid}
                    refreshing={refreshing}
                />
            </View>
            <ScHandSwitch
                refreshDisplay={false}
                docRefresh={() => { }}
                cancelAction={cancelPressAction}
                theme={theme}
                t={t}
            />
        </View>
    );
};

export default WORefer;