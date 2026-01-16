import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, SegmentedButtons, AnimatedFAB, Card, IconButton } from "react-native-paper";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeSwapPosition } from "../../../store/slice/swapPosition";
import ScPubTree from "../ScPubTree/ScPubTree";

import { simpDeptRepo } from "../../../db/crud/department";
import DocList from "../../DocList/DocList";
import { pubParams } from "../../pub/pubParams";
import { SimpDept } from "../../../dataType/types/department";

interface deptPickerProps {
    pressItemAction: (item: SimpDept) => void;
    cancelAction: () => void;
    currentItem: SimpDept;
    t: TFunction
}
interface deptCardProps {
    item: SimpDept
}
// Convert an Array of department objects into an array of department IDs
const transforDeptIDs = (dept: SimpDept) => {
    let selectDeptIds = [];
    selectDeptIds.push(dept.id);
    return selectDeptIds;
};

const DeptPicker = ({ pressItemAction, cancelAction, currentItem }: deptPickerProps) => {
    const [depts, setDepts] = useState<SimpDept[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const selectedDeptIds = transforDeptIDs(currentItem);
    const { t } = useTranslation();

    // Command buttons position
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    // Switch command buttons postion
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    const handleInitDepts = (allFlag = allOrRecent) => {
        let localDepts: SimpDept[] = [];
        if (allFlag === "all") {
            localDepts = simpDeptRepo.getAllData();
        } else {
            localDepts = simpDeptRepo.getRecent();
        }
        setDepts(localDepts);
    };

    useEffect(() => {
        handleInitDepts();
    }, []);

    // Switch  SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDepts(value);
    };

    // Actions after press SimpDept Item
    const handlePress = (item: SimpDept) => {
        if (allOrRecent === "all") {
            simpDeptRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Actions after long press SimpDept Item
    const handleLongPress = (item: SimpDept) => {
        if (allOrRecent === "recent") {
            simpDeptRepo.deleteRecent(item);
            handleInitDepts();
        }
        return
    };

    // Refersh 
    const handleDocRefresh = async () => {
        await simpDeptRepo.initCache();
        handleInitDepts(allOrRecent);
    };

    const DeptCard = ({ item }: deptCardProps) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4
                    }}
                    onPress={() => pressItemAction(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.primary }}>{t("deptName")}:{item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("deptCode")}:{item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")}:{item.description}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>{t("leader")}:{item.leader.name}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>{t("status")}:{t(item.status === 0 ? "normal" : "disable")}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
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
                    <Text variant="titleMedium">{t("chooseDept")}</Text>
                </View>
                <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                    <SegmentedButtons
                        value={allOrRecent}
                        onValueChange={(value: "recent" | "all") => handleChangeSeg(value)}
                        buttons={[
                            {
                                value: "recent",
                                label: t("recents")
                            },
                            {
                                value: "all",
                                label: t("all")
                            }
                        ]}
                    />
                </View>
            </View>
            {allOrRecent === "all"
                ? <ScrollView>
                    <ScPubTree
                        docName={t("department")}
                        isDisplayAll={true}
                        oriDocs={depts}
                        onDocPress={handlePress}
                        selectDocIDs={selectedDeptIds}
                        onDocLongPress={handleLongPress}
                        isEdit={true}
                    />
                </ScrollView>
                : <DocList<SimpDept>
                    rows={depts}
                    ItemElement={DeptCard}
                    rowsPerPage={10}
                    searchFields={["code", "name", "description", "leader"]}
                    sortFunction={(a, b) => a.id - b.id}
                    refreshing={false}
                />
            }
            {isOffline === 0
                ? <AnimatedFAB
                    icon="refresh"
                    label={t("refresh")}
                    extended={false}
                    visible={true}
                    onPress={handleDocRefresh}
                    animateFrom={buttonPosition}
                    style={{ bottom: 128, position: "absolute", ...orderPosition }}
                />
                : null
            }
            <AnimatedFAB
                icon="keyboard-return"
                label={t("back")}
                extended={false}
                visible={true}
                onPress={cancelAction}
                animateFrom={buttonPosition}
                style={{ bottom: 64, position: "absolute", ...orderPosition }}
            />
            <IconButton
                icon="swap-horizontal"
                iconColor={theme.colors.primary}
                onPress={handleSwapPosition}
                style={{ bottom: 160, position: "absolute", ...swapPosition }}
            />
        </View>
    )
};

export default DeptPicker;
