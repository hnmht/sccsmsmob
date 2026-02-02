import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, SegmentedButtons, AnimatedFAB, Card, IconButton } from "react-native-paper";
import { TFunction } from "i18next";
import ScPubTree from "../ScPubTree/ScPubTree";
import DocList from "../../DocList/DocList";
import { SimpEPC } from "../../../dataType/types/epc";
import { simpEPCRepo } from "../../../db/crud/epc";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";

interface EPCPickerProps {
    pressItemAction: (item: SimpEPC) => void;
    cancelAction: () => void;
    currentItem: SimpEPC;
    t: TFunction
}

// Convert an Array of SimpEPC object into an array of SimpEPC IDs
const convertSimpEPCToIDs = (doc: SimpEPC) => {
    let selectDocIds = [];
    selectDocIds.push(doc.id);
    return selectDocIds;
};

const EPCPIcker = ({ pressItemAction, cancelAction, currentItem, t }: EPCPickerProps) => {
    const [docs, setDocs] = useState<SimpEPC[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const theme = useTheme();
    const selectedDocIds = convertSimpEPCToIDs(currentItem);

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: SimpEPC[] = [];
        if (allFlag === "all") {
            localDocs = simpEPCRepo.getAllData();
        } else {
            localDocs = simpEPCRepo.getRecent();
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

    // Actions after Press SimpEPC item
    const handlePress = (item: SimpEPC) => {
        if (allOrRecent === "all") {
            simpEPCRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Actions after long press SimpEPC item
    const handleLongPress = (item: SimpEPC) => {
        if (allOrRecent === "recent") {
            simpEPCRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    // Refresh
    const handleDocRefresh = async () => {
        await simpEPCRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    const EPCCard = ({ item }: { item: SimpEPC }) => {
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} : {item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")}: {t(item.status === 0 ? "normal" : "disable")}</Text>
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
                    <Text variant="titleMedium">{t("chooseCategory")}</Text>
                </View>
                <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                    <SegmentedButtons
                        value={allOrRecent}
                        onValueChange={(value) => handleChangeSeg(value)}
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
                        docName={t("category")}
                        isDisplayAll={false}
                        oriDocs={docs}
                        onDocPress={handlePress}
                        selectDocIDs={selectedDocIds}
                        onDocLongPress={handleLongPress}
                        isEdit={true}
                    />
                </ScrollView>
                : <DocList
                    rows={docs}
                    ItemElement={EPCCard}
                    rowsPerPage={10}
                    searchFields={["name", "description"]}
                    sortFunction={(a, b) => a.id - b.id}
                    refreshing={false}
                />
            }
            <ScHandSwitch
                docRefresh={handleDocRefresh}
                cancelAction={cancelAction}
            />
        </View>
    )
};

export default EPCPIcker;
