import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { TFunction } from "i18next";
import DocList from "../../DocList/DocList";
import { RiskLevel } from "../../../dataType/types/riskLevel";
import { riskLevelRepo } from "../../../db/crud/risklevel";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";

interface RLPickerProps {
    cancelAction: () => void;
    pressItemAction: (item: RiskLevel) => void;
    currentItem: RiskLevel;
    t: TFunction
}

const RLPicker = ({ cancelAction, pressItemAction, currentItem, t }: RLPickerProps) => {
    const theme = useTheme();
    const [docs, setDocs] = useState<RiskLevel[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs = [];
        if (allFlag === "all") {
            localDocs = riskLevelRepo.getAllData();
        } else {
            localDocs = riskLevelRepo.getRecent();
        }
        setDocs(localDocs);
    };

    useEffect(() => {
        handleInitDocs();
    }, []);

    // Switch SegmentedButton
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDocs(value);
    };

    // Actions after press Risk Level item
    const handlePress = (item: RiskLevel) => {
        if (allOrRecent === "all") {
            riskLevelRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await riskLevelRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Risk Level item
    const handleLongPress = (item: RiskLevel) => {
        if (allOrRecent === "recent") {
            riskLevelRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const RLCard = ({ item }: { item: RiskLevel }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 2 }}>
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>
                        {t("name")} : {item.name}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <View style={{ height: 24, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                        <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("color")} : </Text>
                        <View style={{ height: "100%", width: 48, backgroundColor: item.color, borderRadius: 8 }}></View>
                    </View>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")}:{item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("riskLevel")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
            />
            <DocList
                rows={docs}
                ItemElement={RLCard}
                rowsPerPage={10}
                searchFields={["name", "description"]}
                sortFunction={(a, b) => a.id - b.id}
                refreshing={false}
            />
            <ScHandSwitch
                docRefresh={handleRefresh}
                cancelAction={cancelAction}
            />
        </View>
    );
};

export default RLPicker;