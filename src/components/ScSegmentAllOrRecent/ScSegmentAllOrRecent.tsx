import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";

interface ScSegmentAllOrRecentProps {
    title: string;
    allOrRecent: "recent" | "all";
    setAllOrRecent: (value: "recent" | "all") => void;
}

function ScSegmentAllOrRecent({ title, allOrRecent, setAllOrRecent }: ScSegmentAllOrRecentProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
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
                <Text variant="titleMedium">{t(title)}</Text>
            </View>
            <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                <SegmentedButtons
                    value={allOrRecent}
                    onValueChange={(value) => setAllOrRecent(value)}
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
    )
}

export default ScSegmentAllOrRecent;