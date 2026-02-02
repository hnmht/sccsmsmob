import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, useTheme, SegmentedButtons } from "react-native-paper";
import { TFunction } from "i18next";

import DocList from "../../DocList/DocList";
import { UserDefinedArchive } from "../../../dataType/types/uda";
import { UserDefineCategory } from "../../../dataType/types/udc";
import { UDARepo } from "../../../db/crud/uda";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";

interface UDAPickerProps {
    udc: UserDefineCategory;
    pressItemAction: (item: UserDefinedArchive) => void;
    cancelAction: () => void;
    currentItem: UserDefinedArchive;
    t: TFunction
}

const UDAPicker = ({ udc, pressItemAction, cancelAction, currentItem, t }: UDAPickerProps) => {
    const theme = useTheme();
    const [docs, setDocs] = useState<UserDefinedArchive[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const criteria = `udcid=${udc.id}`;

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: UserDefinedArchive[] = [];
        if (allFlag === "all") {
            localDocs = UDARepo.queryData(criteria);
        } else {
            localDocs = UDARepo.queryRecent(criteria);
        }
        setDocs(localDocs);
    };

    useEffect(() => {
        handleInitDocs();
    }, []);

    // Switch SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDocs(value);
    };

    // Actions after press UserDefineArchive item
    const handlePress = (item: UserDefinedArchive) => {
        if (allOrRecent === "all") {
            UDARepo.addRecent(item);
        }
        pressItemAction(item);
    };

    // Actions after long press UserDefineArchive item
    const handleLongPress = (item: UserDefinedArchive) => {
        if (allOrRecent === "recent") {
            UDARepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    // Refresh
    const handleDocRefresh = async () => {
        await UDARepo.initCache();
        handleInitDocs(allOrRecent);
    };


    const UDACard = ({ item }: { item: UserDefinedArchive }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 4 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4
                    }}
                    onPress={() => handlePress(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} : {item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("code")} : {item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("udc")} : {item.udc.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
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
                    <Text variant="titleMedium">选择档案</Text>
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
            <DocList
                rows={docs}
                ItemElement={UDACard}
                rowsPerPage={10}
                searchFields={["code", "name", "description"]}
                sortFunction={(a, b) => a.id - b.id}
                refreshing={false}
            />
           
           <ScHandSwitch
                docRefresh={handleDocRefresh}
                cancelAction={cancelAction}
            />

        </View>
    );
};

export default UDAPicker;