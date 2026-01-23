import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, useTheme, SegmentedButtons, AnimatedFAB, IconButton } from "react-native-paper";
import { TFunction } from "i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeSwapPosition } from "../../../store/slice/swapPosition";
import DocList from "../../DocList/DocList";
import { pubParams } from "../../pub/pubParams";
import { Person } from "../../../dataType/types/person";
import { personRepo } from "../../../db/crud/person";


interface personPickerProps {
    t: TFunction;
    cancelAction: () => void;
    pressItemAction: (item: Person) => void;
}

const PersonPicker = ({ t, cancelAction, pressItemAction }: personPickerProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const [persons, setPersons] = useState<Person[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    // Command button position
    const { buttonPosition, swapPosition, orderPosition } = useAppSelector(state => state.swapPosition);
    // Switch command buttons position
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    const handleInitPersons = (allFlag = allOrRecent) => {
        let localPersons = [];
        if (allFlag === "all") {
            localPersons = personRepo.getAllData();
        } else {
            localPersons = personRepo.getRecent();
        }
        setPersons(localPersons);
    };

    useEffect(() => {
        handleInitPersons();
    }, []);

    // Switch SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitPersons(value);
    };

    // Actions after press Person item
    const handlePersonPress = (item: Person) => {
        if (allOrRecent === "all") {
            personRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh persons
    const handlePersonRefresh = async () => {
        await personRepo.initCache();
        handleInitPersons(allOrRecent);
    };
    // Remove the item from "Recents" after a long press
    const handleLongPress = (item: Person) => {
        if (allOrRecent === "recent") {
            personRepo.deleteRecent(item);
            handleInitPersons();
        }
        return
    };

    const PersonCard = ({ item }: { item: Person }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4
                    }}
                    onPress={() => handlePersonPress(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>用户名:{item.name}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>用户编码:{item.code}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>部门:{item.deptName}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>电话:{item.mobile}</Text>
                    <Text style={{ width: "50%", padding: 2 }}>性别:{item.gender === 0 ? "" : item.gender === 1 ? "男" : "女"}</Text>
                    <Text style={{ width: "50%", padding: 2 }}>状态:{item.status === 0 ? "正常" : "停用"}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
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
                    <Text variant="titleMedium">选择人员</Text>
                </View>
                <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                    <SegmentedButtons
                        value={allOrRecent}
                        onValueChange={(value) => handleChangeSeg(value)}
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
            <DocList<Person>
                rows={persons}
                ItemElement={PersonCard}
                rowsPerPage={10}
                searchFields={["code", "name", "deptname", "mobile"]}
                sortFunction={(a: Person, b: Person) => a.name.localeCompare(b.name)}
                refreshing={false}
            />
            {isOffline === 0
                ? <AnimatedFAB
                    icon="refresh"
                    label="刷新"
                    extended={false}
                    visible={true}
                    onPress={handlePersonRefresh}
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
    );
};

export default PersonPicker;