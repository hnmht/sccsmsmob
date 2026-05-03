import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, IconButton, AnimatedFAB, Card, MD3Theme } from "react-native-paper";
import { DateTimeFormat, dayjs } from "../../i18n/dayjs"

import DocList from "../../components/DocList/DocList";
import { transConditionsToString } from "../../components/QueryPanel";
import { reqReferEO } from "../../api/executionOrder";
import { reoSortByID } from "./constructor";
import { useAppSelector } from "../../store/hooks";
import { Condition } from "../../dataType/types/queryPanel";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { TFunction } from "i18next";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

interface EOReferProps {
    isOffline: boolean;
    title: string;
    conditions: Condition[];
    cancelPressAction: () => void;
    okPressAction: (eor: ReferExecutionOrder) => void;
    filterButtonDisp: boolean;
    filterAction: () => void;
    theme: MD3Theme;
    t: TFunction;
}

function EORefer({
    isOffline,
    title,
    conditions,
    cancelPressAction,
    okPressAction,
    filterButtonDisp,
    filterAction,
    theme,
    t
}: EOReferProps) {
    const [rows, setRows] = useState<ReferExecutionOrder[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const eoRefs = useAppSelector(state => state.dynamicData.eoRefs);

    useEffect(() => {
        async function reqData() {
            setRefreshing(true);
            let newRows: ReferExecutionOrder[] = [];
            if (isOffline) {
                let querystring = transConditionsToString(conditions);
                const res = await reqReferEO({ queryString: querystring });
                if (res.status) {
                    newRows = res.data;
                }
            } else {
                newRows = eoRefs;
            }
            setRows(newRows);
            setRefreshing(false);
        }
        reqData();
    }, [conditions, isOffline]);

    const EORCard = ({ item }: { item: ReferExecutionOrder }) => {
        const eor = item;
        return (
            <Card key={eor.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity onPress={() => okPressAction(eor)} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", margin: 4 }}>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }}>现场: {eor.csa.name}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>执行项目: {eor.epa.name}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>项目值: {eor.executionValueDisp}</Text>
                    <View style={{ width: "100%", height: 24, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                        <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>风险等级:{eor.riskLevel.name} </Text>
                        <View style={{ height: "100%", width: 48, backgroundColor: eor.riskLevel.color, borderRadius: 8 }}></View>
                    </View>
                    <Text variant="titleSmall" style={{ width: "100%" }}>说明: {eor.description}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>指定处理人: {eor.executor.name}</Text>
                    <Text variant="titleSmall" style={{ width: "100%", color: theme.colors.primary }}>处理开始时间: {DateTimeFormat(eor.handleStartTime, "LLL")}</Text>
                    <Text variant="titleSmall" style={{ width: "100%", color: theme.colors.primary }}>处理结束时间: {DateTimeFormat(eor.handleEndTime, "LLL")}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>单据编号: {eor.billNumber}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>行号: {eor.rowNumber}</Text>
                    <Text variant="titleSmall" style={{ width: "100%" }}>单据日期: {dayjs(eor.billDate).format("YYYY-MM-DD")}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>制单人: {eor.executor.name}</Text>
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
                    ItemElement={EORCard}
                    rowsPerPage={10}
                    searchFields={["billdate", "billnumber", "eit.name", "createuser.name", "confirmuser.name", "department.name", "starttime", "endtime"]}
                    sortFunction={reoSortByID}
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

export default EORefer;


