import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, SegmentedButtons, AnimatedFAB, Card, IconButton } from "react-native-paper";
import { TFunction } from "i18next";

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
//将当前选择部门转换为部门id数组
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

    //命令按钮位置
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    //切换命令按钮位置
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

    //最近和所有值全部切换
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDepts(value);
    };

    //点击后的操作
    const handlePress = (item: SimpDept) => {
        if (allOrRecent === "all") {
            simpDeptRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    //长按删除最近
    const handleLongPress = (item: SimpDept) => {
        if (allOrRecent === "recent") {
            simpDeptRepo.deleteRecent(item);
            handleInitDepts();
        }
        return
    };

    //刷新部门
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
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>部门名称:{item.name}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>部门编码:{item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>部门说明:{item.description}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>负责人:{item.leader.name}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>状态:{item.status === 0 ? "正常" : "停用"}</Text>
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
                    <Text variant="titleMedium">选择部门</Text>
                </View>
                <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                    <SegmentedButtons
                        value={allOrRecent}
                        onValueChange={(value: "recent" | "all") => handleChangeSeg(value)}
                        buttons={[
                            {
                                value: "recent",
                                label: "最近"
                            },
                            {
                                value: "all",
                                label: "全部"
                            }
                        ]}
                    />
                </View>
            </View>
            {allOrRecent === "all"
                ? <ScrollView>
                    <ScPubTree
                        docName={"部门"}
                        isDisplayAll={false}
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
                    label="刷新"
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
                label="返回"
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
